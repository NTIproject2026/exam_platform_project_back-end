import type {
  HydratedDocument,
  Model,
  PopulateOptions,
  ProjectionFields,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose'

class baseRepo<I> {
  constructor(protected readonly _model: Model<I>) {}

  //create document
  async create({ data }: { data: I }): Promise<HydratedDocument<I> | null> {
    return await this._model.create(data)
  }

  // find all documents
  async findAllDocuments({
    filter,
    projection,
    options,
  }: {
    filter: QueryFilter<I>
    projection?: ProjectionFields<I>
    options?: QueryOptions
  }): Promise<HydratedDocument<I | any> | null> {
    return await this._model
      .find(filter, projection)
      .limit(options?.limit!)
      .skip(options?.skip!)
      .sort(options?.sort!)
      .populate(options?.populate as PopulateOptions)
  }
  // find first document
  async findOneDocument({
    filter,
    projection,
    options: QueryOptions

  }: {
    filter: QueryFilter<I>
    projection?: ProjectionFields<I>
    options?: QueryOptions
  }): Promise<HydratedDocument<I | any> | null> {
    const query = this._model.findOne(filter)
    if (projection) {
      query.projection(projection)
    }
    return await query
  }
  // find document by id
  async findDocumentById({
    id,
    projection,
    options,
  }: {
    id: Types.ObjectId
    projection?: ProjectionFields<I>
    options?: QueryOptions
  }): Promise<HydratedDocument<I | any> | null> {
    return await this._model.findById(id, projection, options)
  }
  // update document by filter
  async updateDocument({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<I>
    update: UpdateQuery<I>
    options?: QueryOptions
  }): Promise<HydratedDocument<I | any> | null> {
    return await this._model.findOneAndUpdate(filter, update, {
      returnDocument: 'after',
      ...options,
    })
  }
  // update document by id
  async updateDocumentById({
    id,
    update,
    options,
  }: {
    id: Types.ObjectId
    update: UpdateQuery<I>
    options?: QueryOptions
  }): Promise<HydratedDocument<I | any> | null>  {
    return await this._model.findByIdAndUpdate(id, update, {
      returnDocument: 'after',
      ...options,
    })
  }
  // delete document by filter
  // hard delete
  async deleteOneDocument({
    filter,
  }: {
    filter: QueryFilter<I>
    options?: QueryOptions
  }): Promise<HydratedDocument<I | any> | null> {
    return await this._model.deleteOne(filter)
  }
  // delete document by id\
  // hard delete
  async deleteManyDocument({
    filter,
  }: {
    filter: QueryFilter<I>
    options?: QueryOptions
  }): Promise<HydratedDocument<I | any> | null> {
    return await this._model.deleteMany(filter)
  }
  // count documents
  async countDocuments({
    filter,
  }: {
    filter: QueryFilter<I>
  }): Promise<number> {
    return await this._model.countDocuments(filter)
  }
}

export default baseRepo
