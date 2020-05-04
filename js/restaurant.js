class Restaurant {
    constructor(data){
      this.DOM      = document.createElement('li');
      this.name     = data.restaurantName;
      this.lat      = data.lat;
      this.long     = data.long;
      this.comments = data.ratings;
      this.average();

      this.viewDetails = false;

      this.DOM.onclick = this.showHideRatings.bind(this);
      this.DOM.className = 'list-group-item';
      document.getElementsByTagName("ul")[0].appendChild(this.DOM)
      this.render();
      //this.showStart()
      this.addMarker(this.lat, this.long, this.name)
      
    }

    average(){
      let score = 0;
      for (let index = 0; index < this.comments.length; index++) {
        score += this.comments[index].stars;
      }
      this.avering = score / this.comments.length;
    }

    makeStars(qty){
      return `<span id="myRating" class="rating"
       data-default-rating="${qty}"  disabled></span> 
       `;
    }

    render() {
      let content = `name ${this.name} --- ${this.makeStars(this.avering)}`
      if (this.viewDetails){
        content +=`
        <ul>${this.renderRatings()}</ul>
        ${this.renderAddComment()}
      `;
      }else{
        this.DOM.onclick = this.showHideRatings.bind(this);
      }
      this.DOM.innerHTML =  content;
    }

    renderAddComment(){
      return `
          <input name="commentaires" value="good good" id='comments' placeholder="ajouter un commentaire">
          <input name="stars" id='rates' value="3" >
          <button >ajoute un commentaire</button>
        `;
    }

    addComment(){
      let rates = {
        "stars": $('#rates').val(),
        "comment": $('#comments').val()
      }
      this.comments.push(rates)
      this.renderRatings()
    }


    renderRatings(){
      let content = "";
      for (let i=0; i< this.comments.length; i++){
        content += `<li>${this.makeStars(this.comments[i].stars)} ${this.comments[i].comment}</li>`;
      }
      return content;
      
    }

    showHideRatings(){
      this.updateState("viewDetails", !this.viewDetails);
    }

    updateState(key, value){
      this[key] = value;
      this.render();
    }
    /*
    showStart(){
      var ratings = document.getElementsByClassName('rating');

      for (var i = 0; i < ratings.length; i++) {
          var r = new SimpleStarRating(ratings[i]);
  
      }
    }
    */

    addMarker (lat, long, name, ){
      var marker = L.marker([this.lat, this.long]).addTo(mymap).on('click', (e) =>{
         // alert('make ajax request to the api')
          window.addGoogleStreetView(this.lat, this.long)
      });
      let msg = '<b>'+ this.name + '<b>'+'<br><br>'
      marker.bindPopup(msg);
    }
  }
