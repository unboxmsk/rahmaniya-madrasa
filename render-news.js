(function () {
  const fallbackImage = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="#e9e2d4"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#0f5c3a" font-family="Arial, sans-serif" font-size="48">Rahmaniya Media</text></svg>'
  );

  function getDriveFileId(url) {
    if (!url) {
      return "";
    }

    const filePathMatch = url.match(/\/file\/d\/([^/]+)/);
    if (filePathMatch && filePathMatch[1]) {
      return filePathMatch[1];
    }

    const idParamMatch = url.match(/[?&]id=([^&]+)/);
    if (idParamMatch && idParamMatch[1]) {
      return idParamMatch[1];
    }

    return "";
  }

  function normalizeImageUrl(url) {
    const driveFileId = getDriveFileId(url);

    if (driveFileId) {
      return "https://drive.google.com/thumbnail?id=" + driveFileId + "&sz=w1200";
    }

    return url || fallbackImage;
  }

  function isValidNewsItem(item) {
    return item && item.title && item.date && item.description && item.link;
  }

  function createArchiveCard(item) {
    const article = document.createElement("article");
    article.className = "archive-card";

    article.innerHTML = [
      '<img alt="">',
      '<div class="archive-body">',
      '  <span class="tag"></span>',
      '  <h3 class="headline"></h3>',
      '  <p></p>',
      '  <a class="button button-primary" target="_blank" rel="noreferrer">Download photos and videos</a>',
      "</div>"
    ].join("");

    const image = article.querySelector("img");
    const tag = article.querySelector(".tag");
    const title = article.querySelector("h3");
    const description = article.querySelector("p");
    const link = article.querySelector("a");

    image.src = normalizeImageUrl(item.image);
    image.alt = item.title;
    image.onerror = function () {
      this.onerror = null;
      this.src = fallbackImage;
    };

    tag.textContent = item.date;
    title.textContent = item.title;
    description.textContent = item.description;
    link.href = item.link;

    return article;
  }

  function createHomepageCard(item) {
    const article = document.createElement("article");
    article.className = "card";

    article.innerHTML = [
      '<img alt="">',
      '<div class="card-body">',
      '  <p class="meta"></p>',
      '  <h3 class="headline"></h3>',
      '  <p></p>',
      '  <a class="link-arrow">See archive entry</a>',
      "</div>"
    ].join("");

    const image = article.querySelector("img");
    const meta = article.querySelector(".meta");
    const title = article.querySelector("h3");
    const description = article.querySelector(".card-body > p:last-of-type");
    const link = article.querySelector("a");

    image.src = normalizeImageUrl(item.image);
    image.alt = item.title;
    image.onerror = function () {
      this.onerror = null;
      this.src = fallbackImage;
    };

    meta.textContent = item.date;
    title.textContent = item.title;
    description.textContent = item.description;
    link.href = "media.html";

    return article;
  }

  function createHomepageFeatureCard() {
    const article = document.createElement("article");
    article.className = "feature-card";

    article.innerHTML = [
      "<div>",
      '  <p class="meta">Media Archive</p>',
      '  <h3 class="headline">Browse the full collection of events, photographs, and highlights.</h3>',
      '  <p>The archive page gathers key celebrations and downloadable media in one consistent place.</p>',
      "</div>",
      '<div class="feature-actions">',
      '  <a class="button button-light" href="media.html">Open media page</a>',
      '  <a class="button button-ghost" href="https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0Jsample" target="_blank" rel="noreferrer">Open Google Drive</a>',
      "</div>"
    ].join("");

    return article;
  }

  const safeNewsData = Array.isArray(window.newsData)
    ? window.newsData.filter(isValidNewsItem)
    : [];

  const newsContainer = document.getElementById("news-container");
  if (newsContainer) {
    safeNewsData.forEach(function (item) {
      newsContainer.appendChild(createArchiveCard(item));
    });
  }

  const homepageNews = document.getElementById("homepage-news");
  if (homepageNews) {
    const latestNews = safeNewsData.slice(0, 2);
    latestNews.forEach(function (item) {
      homepageNews.appendChild(createHomepageCard(item));
    });
    homepageNews.appendChild(createHomepageFeatureCard());
  }
})();
