class Github {
    constructor(githubClientID, githubTajniKljuc){
        this.githubClientID = githubClientID;
        this.githubTajniKljuc = githubTajniKljuc;
    }

  dajGithubAuthURL(povratniURL) {
    return `https://github.com/login/oauth/authorize?client_id=${this.githubClientID}&redirect_uri=${povratniURL}`;
  }

  async dajAccessToken(dobiveniKod) {
    const parametri = { method: "POST", headers: { Accept: "application/json" } };
    const urlParametri = `?client_id=${this.githubClientID}&client_secret=${this.githubTajniKljuc}&code=${dobiveniKod}`;
    const odgovor = await fetch(`https://github.com/login/oauth/access_token${urlParametri}`, parametri);
    const podaci = await odgovor.text();
    return JSON.parse(podaci).access_token;
  }

  async provjeriToken(token) {
    const parametri = { method: "GET", headers: { Authorization: `Bearer ${token}` } };
    const odgovor = await fetch("https://api.github.com/user", parametri);
    const podaci = await odgovor.json();
    return podaci;
  }
}

module.exports = Github;