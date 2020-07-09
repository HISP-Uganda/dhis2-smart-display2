import {decorate, observable, action, extendObservable, computed} from "mobx";
import {Presentation} from './models/Presentation';
import {Dashboard} from './models/Dashboard';
import {DashboardItem} from './models/DashboardItem';
import {DashboardItemContent} from './models/DashboardItemContent';
import {init} from 'd2';
import {generateUid} from 'd2/uid';
import GroupStore from "./models/GroupStore";
import {extractFavorite} from "./modules/utils";

const query = {
  dashboards: {
    resource: 'dashboards.json',
    params: {
      fields: 'id,name,displayName,description,displayDescription,favorite,user[id,displayName~rename(name)],created,lastUpdated,access,dashboardItems[id,type,shape,messages,text,appKey,reports[id,displayName~rename(name)],resources[id,displayName~rename(name)],users[id,displayName~rename(name)],reportTable[id,displayName~rename(name),displayDescription~rename(description)],chart[type,id,displayName~rename(name),displayDescription~rename(description)],map[id,displayName~rename(name),displayDescription~rename(description)],eventReport[id,displayName~rename(name),displayDescription~rename(description)],eventChart[id,displayName~rename(name),displayDescription~rename(description)]]',
      paging: 'false'
    }
  }
}

const convertDashboard = (d) => {
  const dashboard = new Dashboard();
  const {id, name, dashboardItems} = d;
  extendObservable(dashboard, {id, name});
  const convertedDashboardItems = dashboardItems.map(item => {
    const dashboardItem = new DashboardItem();
    let {id: dashboardItemId, type, shape, selected, dashboardItemContent} = item;
    extendObservable(dashboardItem, {
      id: dashboardItemId,
      type,
      shape,
      selected: selected === undefined ? true : selected
    });
    if (!dashboardItemContent) {
      dashboardItemContent = extractFavorite(item);
    }
    const {id: contentId, name: contentName, interpretations} = dashboardItemContent;
    const content = new DashboardItemContent();
    extendObservable(content, {id: contentId, name: contentName, interpretations, type});
    dashboardItem.setDashboardItemContent(content)
    return dashboardItem
  });
  dashboard.setDashboardItems(convertedDashboardItems);
  return dashboard
}

export class Store {
  engine;
  presentations = [];
  d2;
  baseUrl;
  apiVersion;
  currentPresentation = new Presentation();
  assignedItemStore = GroupStore.create({state: []});
  itemStore = GroupStore.create({state: []});
  availableDashboards = [];
  fullScreen = false;
  previewing = false;

  paging = {
    presentations: {
      pageSize: 3,
      page: 1
    }
  }

  page = '1';
  presentationFilter = '';

  constructor(engine, baseUrl, apiVersion) {
    this.engine = engine;
    this.currentPresentation.setEngine(this.engine);
    this.baseUrl = baseUrl;
    this.apiVersion = apiVersion;
  }

  setPresentation = val => {
    this.currentPresentation = val;
    this.currentPresentation.setEngine(this.engine);
  }

  convert = (pre) => {
    const {name, description, id, transModes, transitionDuration, slideDuration, dashboards} = pre
    let p = new Presentation();
    extendObservable(p, {name, description, id, transModes, transitionDuration, slideDuration});
    const convertedDashboards = dashboards.map(d => convertDashboard(d));
    p.setDashboards(convertedDashboards);
    return p;
  };

  hidePreview = () => {
    this.previewing = false;
  }

  showPreview = () => {
    this.previewing = true;
  }

  setPage = val => {
    this.page = val
  };

  setD2 = async () => {
    this.d2 = await init({
      appUrl: this.baseUrl,
      baseUrl: `${this.baseUrl}/api/${this.apiVersion}`
    });
  };

  assignItems = (items) => {
    const assigned = this.assignedItemStore.state.concat(items);
    this.assignedItemStore.setState(assigned);
    this.currentPresentation.setDashboards(this.availableDashboards.filter(ds => assigned.indexOf(ds.id) !== -1));
    return Promise.resolve();
  }
  unAssignItems = (items) => {
    const assigned = this.assignedItemStore.state.filter(item => items.indexOf(item) === -1);
    this.assignedItemStore.setState(assigned);
    this.currentPresentation.setDashboards(this.currentPresentation.dashboards.filter(d => assigned.indexOf(d.id) === -1))
    return Promise.resolve();
  }

  fetchDashboards = async () => {
    const {dashboards: {dashboards}} = await this.engine.query(query);
    let items = dashboards.map(d => {
      return {text: d.name, value: d.id};
    });
    this.availableDashboards = dashboards.map(ds => convertDashboard(ds));
    this.itemStore.setState(items);
  }

  fetchPresentations = async () => {
    try {
      const val = await this.d2.dataStore.has('smart-slides');
      if (val) {
        const namespace = await this.d2.dataStore.get('smart-slides');
        const presentations = await namespace.get('presentations');
        this.presentations = presentations.map(pre => this.convert(pre));
        if (this.presentations.length > 0) {
          this.setPage('3')
        }
      } else {
        const namespace = await this.d2.dataStore.create('smart-slides');
        namespace.set('presentations', this.presentations);
      }
    } catch (e) {
      console.log(e);
    }
  };

  savePresentation = async () => {
    if (this.currentPresentation.id) {
      const mapping = _.findIndex(this.presentations, {id: this.currentPresentation.id});
      if (mapping !== -1) {
        this.presentations.splice(mapping, 1, this.currentPresentation);
      } else {
        this.presentations = [...this.presentations, this.currentPresentation];
      }
    } else {
      this.currentPresentation.setId(generateUid());
      this.presentations = [...this.presentations, this.currentPresentation];
    }

    const whatToSave = this.presentations.map(p => {
      return p.canBeSaved;
    });
    const namespace = await this.d2.dataStore.get('smart-slides');
    await namespace.set('presentations', whatToSave);
    this.setPage('3');
  };

  setPaging = val => this.paging = val;

  pagingChange = info => (page, pageSize) => {
    let current = this.paging[info];
    if (current) {
      current = {...current, page, pageSize}
      const p = {
        ...this.paging,
        [info]: current
      };
      this.setPaging(p);
    }
  }

  perPageChange = info => (currentPage, size) => {
    let current = this.paging[info];
    if (current && (currentPage !== current.page || current.pageSize !== size)) {
      current = {...current, page: 1, pageSize: size}
      const p = {
        ...this.paging,
        [info]: current
      };
      this.setPaging(p);
    }
  };

  createNewPresentation = () => {
    this.setPresentation(new Presentation());
    this.setPage('2');
  }

  present = presentation => () => {
    this.setPresentation(presentation);

    this.setPage('5')
  };


  deletePresentation = presentation => async () => {
    const mapping = this.presentations.findIndex(p => p.id === presentation.id);
    this.presentations.splice(mapping, 1);
    await this.savePresentation();
  };

  edit = presentation => () => {
    this.setPresentation(presentation);
    const ass = this.currentPresentation.dashboards.map(d => {
      return {text: d.name, value: d.id};
    });
    this.setPage('2');
    this.assignedItemStore.setState(ass);
  };

  preview = presentation => () => {
    this.setPresentation(presentation);
    this.showPreview();
  };

  setPresentationFilter = (e) => {
    this.presentationFilter = e.target.value;
  }


  get currentPresentations() {
    const {page, pageSize} = this.paging.presentations;
    const currentPage = page - 1;
    if (pageSize !== 0) {
      return this.presentations.filter(p => String(p.name)
        .toLowerCase()
        .includes(String(this.presentationFilter).toLowerCase()))
        .slice(currentPage * pageSize, currentPage * pageSize + pageSize);
    }
    return this.presentations.filter(p => String(p.name)
      .toLowerCase()
      .includes(String(this.presentationFilter).toLowerCase()));
  }

get isValid(){
  if (this.currentPresentation.dashboards.length > 0 ){
    return true;

  }
  return false;
}

}

decorate(Store, {
  presentations: observable,
  engine: observable,
  currentPresentation: observable,
  baseUrl: observable,
  availableDashboards: observable,
  paging: observable,
  assignedItemStore: observable,
  fetchPresentations: action,
  fullScreen: observable,
  itemStore: observable,
  apiVersion: observable,
  previewing: observable,
  page: observable,
  d2: observable,
  presentationFilter: observable,

  setPresentation: action,
  convert: action,
  fetchDashboards: action,
  showPreview: action,
  assignItems: action,
  unAssignItems: action,
  setPage: action,
  setD2: action,
  savePresentation: action,
  createNewPresentation: action,
  changeFull: action,
  pagingChange: action,
  setPaging: action,
  hidePreview: action,
  present: action,
  preview: action,
  edit: action,
  setPresentationFilter: action,
  deletePresentation: action,

  currentPresentations: computed,
  isValid: computed
});
