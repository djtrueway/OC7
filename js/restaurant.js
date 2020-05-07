class Restaurant {
    constructor(data){
      this.DOM      = document.createElement('li');
      this.DOMstar = document.createElement("stars");
      this.DOMcomments = document.createElement("comments");
      this.name     = data.restaurantName;
      this.lat      = data.lat;
      this.long     = data.long;
      this.comments = data.ratings;
      this.average();

      this.viewDetails = false;
      // this.render();
      //this.showStart()
      this.addMarker(this.lat, this.long, this.name);
      this.initialRender();
      SimpleStarRating(this.DOMstar);
      this.DOMstar.addEventListener('rate', function (e) {
        console.log(e);

      if(this.userRating !== null) return;
      console.log("wxcwcwxc", e.detail)
      this.DOMstar.innerHTML += this.renderAddComment(); 
      }.bind(this));
      this.userRating = null;
    }

    initialRender(){
      this.DOM.onclick = this.showHideRatings.bind(this);
      this.DOM.className = 'list-group-item';
      document.getElementsByTagName("ul")[0].appendChild(this.DOM);
      this.DOM.innerHTML = this.name;
      this.DOMstar.className="rating";
      // this.DOMstar.setAttribute("data-stars", 15);
      this.DOMstar.setAttribute("data-default-rating", this.avering);
      this.DOMstar.onclick = this.starClick;
      this.DOM.appendChild(this.DOMstar);
      this.DOM.appendChild(this.DOMcomments);
    }

    starClick(event){
      event.stopPropagation();
    }

    newRating(event){     
    }


    average(){
      let score = 0;
      for (let index = 0; index < this.comments.length; index++) {
        score += this.comments[index].stars;
      }
      this.avering = score / this.comments.length;
    }

    makeStars(qty){
      let stars = "";
      for (let i=0; i<qty; i++) stars +="*";
      return stars;
    }

    renderComment() {
      let content = "";
      if (this.viewDetails){
        content +=`
        <ul>${this.renderRatings()}</ul>
      `;
      }
      this.DOMcomments.innerHTML =  content;
    }

    renderAddComment(){
      return `
          <div onclick="event.stopPropagation();">
          <input name="commentaires" id='comments' placeholder="ajouter un commentaire">
          <button >ajoute un commentaire</button>
          </div>
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
      this.renderComment();
    }

    addMarker (lat, long, name, ){
      var marker = L.marker([this.lat, this.long]).addTo(mymap).on('click', (e) =>{
         // alert('make ajax request to the api')
          window.addGoogleStreetView(this.lat, this.long)
      });
      let msg = '<b>'+ this.name + '<b>'+'<br><br>'
      marker.bindPopup(msg);
    }

    showStars(){
    var ratings = document.getElementsByClassName('rating');
    alert(ratings.length)
    for (var i = 0; i < ratings.length; i++) {
        var r = new SimpleStarRating(ratings[i]);

    }
    window.test = SimpleStarRating(ratings[i]);
}
  }
