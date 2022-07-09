import Page from '@models/facebook/page.model';
import { IPage } from '@models/facebook/page.model';

class PageRepo {
  async find(query: IPage) {
    const page = await Page.findOne(query).lean();
    return page;
  }

  
  async createPage(entity: IPage) {
    const page = new Page(entity)
    await page.save();
    return page;
  }

  async updatePage(entity: IPage) {
    const page = await Page.updateOne({ _id: entity._id }, entity);

    return page;
  }

  async findAndUpdate(entity: IPage) {
    const filter = { pageId: entity.pageId };
    const page = await Page.findOneAndUpdate(filter, entity, { new: true , upsert: true });
    return page;
  }
}

const pageRepo = new PageRepo();
export { pageRepo };