class DataHandler{
  constructor(prefix){
    this.data;
    this.dataFormSession = {};
    this.prefix = prefix;
    this.dataGoogle;
  }

  getSession(key){

  }

  addComment(restaurant, comments){
    if(this.dataFormSession[restaurant] === undefined) this.dataFormSession[restaurant] = [];
    this.dataFormSession[restaurant].push(comments);
    sessionStorage.setItem(`${this.prefix}_data`, JSON.stringify(this.dataFormSession));
  }

  async importData(src){
    await this.importJson(src);
    this.importSession();
    // await this.importFromGoogle();
    initmap();
  }

  async importDataFromGoogle(src){
    await this.importFromGoogle(src)
  }

  async importJson(src){
    const response = await fetch(src);
    this.data = await response.json();
  }

  importSession(){
    this.dataFormSession = sessionStorage.getItem(`${this.prefix}_data`);
    this.dataFormSession = JSON.parse(this.dataFormSession);
    if(this.dataFormSession !== null){
      for( let [key, value] of Object.entries(this.data) ){
        if (this.dataFormSession[value.restaurantName] !== undefined) {
          this.data[key].ratings = this.data[key].ratings.concat(this.dataFormSession[value.restaurantName]);
        }
      }
    }else{
      this.dataFormSession = {}
    }
  }
    
  getEvaluation(restaurant){
    for(let [key, value] of Object.entries(this.data)){
      if(value.restaurantName === restaurant){
        console.log(value.ratings)
        return value.ratings;
      } 
    }
  }

  async importFromGoogle(src){
    const response = await fetch(src);
    let dataGoogle = await response.json();
    this.dataGoogle = dataGoogle.results;
    return this.dataGoogle
  }
}