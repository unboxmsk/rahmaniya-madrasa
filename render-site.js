(function () {
  const fallbackImage = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="#efe9dc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#0f5c3a" font-family="Arial, sans-serif" font-size="48">Rahmaniya</text></svg>'
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

  const content = window.siteContent || {};
  const heroImages = Array.isArray(content.heroImages) ? content.heroImages : [];
  const heritageImageUrl = content.heritageImage || "";
  const leaders = Array.isArray(content.leaders) ? content.leaders : [];
  const toppers = Array.isArray(content.toppers) ? content.toppers : [];

  const heroImage = document.getElementById("hero-image");
  if (heroImage && heroImages[0]) {
    heroImage.src = normalizeImageUrl(heroImages[0]);
    heroImage.onerror = function () {
      this.onerror = null;
      this.src = fallbackImage;
    };
  }

  const heritageImage = document.getElementById("heritage-image");
  if (heritageImage && heritageImageUrl) {
    heritageImage.src = normalizeImageUrl(heritageImageUrl);
    heritageImage.onerror = function () {
      this.onerror = null;
      this.src = fallbackImage;
    };
  }

  const leadersContainer = document.getElementById("leaders-container");
  if (leadersContainer) {
    leadersContainer.innerHTML = "";

    const validLeaders = leaders.filter(function (leader) {
      return leader && leader.name && leader.role && leader.phone;
    });

    validLeaders.forEach(function (leader) {
      const article = document.createElement("article");
      article.className = "leader-card";

      article.innerHTML = [
        '<div class="leader-photo"><img alt=""></div>',
        '<h3 class="headline"></h3>',
        '<p class="leader-role"></p>',
        '<a class="button">Call Office</a>'
      ].join("");

      const image = article.querySelector("img");
      const name = article.querySelector("h3");
      const role = article.querySelector(".leader-role");
      const phoneLink = article.querySelector("a");

      image.src = normalizeImageUrl(leader.image);
      image.alt = leader.name;
      image.onerror = function () {
        this.onerror = null;
        this.src = fallbackImage;
      };

      name.textContent = leader.name;
      role.textContent = leader.role;
      phoneLink.href = "tel:" + leader.phone;

      leadersContainer.appendChild(article);
    });

    if (!validLeaders.length) {
      leadersContainer.innerHTML = '<article class="leader-card"><h3 class="headline">No leaders added yet</h3><p class="leader-role">Update sitecontent.js</p></article>';
    }
  }

  const toppersContainer = document.getElementById("toppers-container");
  if (toppersContainer) {
    toppersContainer.innerHTML = "";

    const validToppers = toppers.filter(function (topper) {
      return topper && topper.name && topper.className;
    });

    validToppers.forEach(function (topper) {
      const article = document.createElement("article");
      article.className = "topper-card";

      article.innerHTML = [
        '<div class="topper-photo"><img alt=""></div>',
        '<h3 class="headline"></h3>',
        '<p class="topper-class"></p>'
      ].join("");

      const image = article.querySelector("img");
      const name = article.querySelector("h3");
      const className = article.querySelector(".topper-class");

      image.src = normalizeImageUrl(topper.image);
      image.alt = topper.name;
      image.onerror = function () {
        this.onerror = null;
        this.src = fallbackImage;
      };

      name.textContent = topper.name;
      className.textContent = topper.className;

      toppersContainer.appendChild(article);
    });

    if (!validToppers.length) {
      toppersContainer.innerHTML = '<article class="topper-card"><h3 class="headline">No toppers added yet</h3><p class="topper-class">Update sitecontent.js</p></article>';
    }
  }
})();
