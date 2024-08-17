export interface IDBEvent extends Event {
  target: (EventTarget & { result?: IDBDatabase }) | null;
}

export class IndexDBQueryBuilder<T = any> {
  protected queryBuilder?: IDBObjectStore;

  constructor(
    protected db: IDBDatabase,
    protected entity: string,
    options: IDBObjectStoreParameters & { keyPath: string },
  ) {
    if (!this.db.objectStoreNames.contains(entity)) {
      this.queryBuilder = this.db?.createObjectStore(this.entity, options);
    } else {
      this.queryBuilder = this.db.transaction(this.entity, "readwrite").objectStore(this.entity);
    }
  }

  /**
   *
   * @param name 索引名称
   * @param keyPath 需要索引的属性
   * @param options 其他配置
   * @returns {IDBIndex}
   *
   * 未完成，需要配合 queryBuilder，但是 queryBuilder 的创建需要在 onupgradeneeded 中。
   */
  private createIndex(name: string, keyPath: string | string[], options?: IDBIndexParameters) {
    return this.queryBuilder?.createIndex(name, keyPath, options);
  }

  async insert(data: T, options?: IDBTransactionOptions) {
    const transaction = this.db.transaction(this.entity, "readwrite", options);
    const repository = transaction.objectStore(this.entity);

    return new Promise((resolve, reject) => {
      const handle = repository.add(data);

      handle.onsuccess = (evt) => {
        resolve(handle.result);
      };
      handle.onerror = (evt) => {
        reject(evt);
      };
    });
  }

  async delete(key: string, options?: IDBTransactionOptions) {
    const transaction = this.db.transaction(this.entity, "readwrite", options);
    const repository = transaction.objectStore(this.entity);
    return new Promise((resolve, reject) => {
      const handle = repository.delete(key);

      handle.onsuccess = (evt) => {
        resolve(handle.result);
      };
      handle.onerror = (evt) => {
        reject(evt);
      };
    });
  }

  async update(data: Partial<T>, options?: IDBTransactionOptions) {
    const transaction = this.db.transaction(this.entity, "readwrite", options);
    const repository = transaction.objectStore(this.entity);
    return new Promise((resolve, reject) => {
      const handle = repository.put(data);

      handle.onsuccess = (evt) => {
        resolve(handle.result);
      };
      handle.onerror = (evt) => {
        reject(evt);
      };
    });
  }

  async findBy(key: string, options?: IDBTransactionOptions): Promise<T> {
    const transaction = this.db.transaction(this.entity, "readonly", options);
    const repository = transaction.objectStore(this.entity);
    return new Promise((resolve, reject) => {
      const handle = repository.get(key);

      handle.onsuccess = (evt) => {
        resolve(handle.result);
      };
      handle.onerror = (evt) => {
        reject(evt);
      };
    });
  }
}

export class IndexDB {
  protected db?: IDBDatabase;

  constructor(
    protected database: string,
    protected version = 1,
  ) {
    //
  }

  async connect() {
    //
  }

  async createQueryBuilder<T = any>(
    entity: string,
    options: IDBObjectStoreParameters & { keyPath: string },
  ): Promise<IndexDBQueryBuilder> {
    return new Promise((resolve, reject) => {
      const dbr = window.indexedDB.open(this.database, this.version);
      let queryBuilder: IndexDBQueryBuilder;

      dbr.onerror = (evt: IDBEvent) => {
        this.db = dbr?.result;
        reject(evt);
      };

      dbr.onsuccess = (evt: IDBEvent) => {
        this.db = dbr?.result;
        queryBuilder = new IndexDBQueryBuilder<T>(this.db!, entity, options);
        resolve(queryBuilder);
      };

      dbr.onupgradeneeded = (evt: IDBEvent) => {
        this.db = dbr?.result;
        // createObjectStore 只能在 versionchange 中调用
        // https://developer.mozilla.org/zh-CN/docs/Web/API/IDBDatabase/createObjectStore
        queryBuilder = new IndexDBQueryBuilder<T>(this.db!, entity, options);
      };
    });
  }

  dropQueryBuilder(entity: string) {
    this.db?.deleteObjectStore(entity);
  }

  close() {
    this.db?.close();
  }
}
