import url from 'url';

class ApiResponse {
  private data;
  private offset;
  // private pageCount;
  private limit;
  private totalCount;
  private links;

  constructor(data, offset, limit, totalCount, req) {
    this.data = data;
    this.offset = offset;
    // this.pageCount = pageCount;
    this.limit = limit;
    this.totalCount = totalCount;
    this.links = {};

    const appUrl =
      req.protocol +
      '://' +
      req.get('host') +
      url.parse(req.originalUrl).pathname;

    this.addSelfLink(appUrl);
    if (offset >= 1 && offset < pageCount) {
      this.addNextLink(appUrl);
    }

    if (offset > 1 && offset <= pageCount) {
      this.addPrevLink(appUrl);
    }
  }

  public addSelfLink(appUrl) {
    this.links.self = appUrl + '?page=' + this.offset + '&limit=' + this.limit; // self page
  }

  public addNextLink(appUrl) {
    const afterPage = this.offset + 1;
    this.links.next = appUrl + '?page=' + afterPage + '&limit=' + this.limit; // next page
    this.links.last =
      appUrl + '?page=' + this.pageCount + '&limit=' + this.limit; // last page
  }

  public addPrevLink(appUrl) {
    const prevPage = this.offset - 1;
    this.links.prev = appUrl + '?page=' + prevPage + '&limit=' + this.limit; // prev page
    this.links.first = appUrl + '?page=1' + '&limit=' + this.limit; // first page
  }
}

export default ApiResponse;
