// Reference from Rob Dongas class tutorial walkthrough
class Navigation {
  constructor(links, pages) {
    this.links = links;
    this.pages = pages;
    this.currentPage = null;
  }

  getHash(link) {
    const href = link.getAttribute("href");
    return href ? href.replace("#", "") : "";
  }

  setPage(pageId) {
    if (!pageId) return;

    const targetPage = document.getElementById(pageId);
    if (!targetPage) return;

    this.currentPage = pageId;

    this.links.forEach((link) => {
      const isActive = this.getHash(link) === pageId;
      link.classList.toggle("active", isActive);
    });

    this.pages.forEach((page) => {
      page.style.display = "none";
    });

    targetPage.style.display = "block";
  }

  init(defaultPageId = null) {
    const firstPageId =
      defaultPageId || (this.links.length ? this.getHash(this.links[0]) : null);

    if (firstPageId) {
      this.setPage(firstPageId);
    }
  }
}

export default Navigation;