import RestProxy, { IProxySettings } from 'sp-rest-proxy/dist/RestProxy';

const settings: IProxySettings = {
  configPath: './.config/private.json'
};

const restProxy = new RestProxy(settings);
restProxy.serve();