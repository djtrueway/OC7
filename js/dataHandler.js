class DataHandler{
  constructor(prefix){
    this.data;
    this.prefix = prefix;
  }

  getSession(key){

  }

  setSession(restaurant, comments){

  }

  async importData(src){
    await this.importJson(src);
    this.importSession();
    // await this.importFromGoogle();
    initmap();

  }

  async importJson(src){
    const response = await fetch(src);
    this.data = await response.json();
  }

  importSession(){
    let dataComments = sessionStorage.getItem(`${this.prefix}_data`);
    dataComments     = JSON.parse(dataComments);
    this.sessionComments = dataComments;
    for( let [key, value] of Object.entries(this.data) ){
      if (dataComments[value.restaurantName] !== undefined) {
        this.data[key].ratings = {
          ...this.data[key].ratings,
          ...dataComments[value.restaurantName]
        }
      }
    }



/*
 forme des données dans le sessionStorage
  {
    nomDuRestaurant: [
      {
          "stars":5,
          "comment":"Tout simplement mon restaurant préféré !"
       },
      {
          "stars":5,
          "comment":"Tout simplement mon restaurant préféré !"
       },
    ]
  }


 */









  }

  getEvaluation(restaurant){

  }

  importFromGoogle(){
    
  }

}