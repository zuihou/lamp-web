export interface DatasourceConfigPageQuery {
  name: string;
  username: string;
}

export interface DatasourceConfigResult {
  name: string;
  username: string;
  password: string;
  url: string;
  driverClassName: string;
  poolName: string;
  type: string;
}

export interface DataSourceProperty {
  poolName: string;
  name: string;
  username: string;
  password: string;
  url: string;
  driverClassName: string;
}

export interface DatasourceConfigSaveDTO {
  name: string;
  username: string;
  password: string;
  url: string;
  driverClassName: string;
}

export interface DatasourceConfigUpdateDTO {
  id: number;
  name: string;
  username: string;
  password: string;
  url: string;
  driverClassName: string;
}

export interface DatasourceConfig {
  id: number;
  name: string;
  username: string;
  password: string;
  url: string;
  driverClassName: string;
  createdTime: string;
  createdBy: string;
  updatedTime: string;
  updatedBy: string;
}
