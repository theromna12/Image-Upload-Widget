/* 
Roman Petruchyk - Zadanie Front-end BePoland

1. This code has a possibility to upload only 1 photo (no multiple file option) - I hope it is how it should be
2. There is only "Upload file" button - no drag&drop. As far as i understand it's an optional functionality => 
"tylko ładowanie plików poprzez element input[type=file] lub obszar drag&drop" 
3. When you press "Delete button" -> photo and it's information is deleted. Map is still visible, but there is no marker 
and map is showing entire planet on zoom = 1 property. 
4. Code is not perfect, but I was trying to do all my best :) 

If you're checking this code => Have a wonderful day 😉❤️
*/

let photo,photoPreviewBlock,photoPreview,photoId,photoSize,pictureGPS,pictureRemoveButton,
photoSizeMb,file,reader,long,lati,longDecimal,latiDecimal,errorGPS,errorSize,marker,map,position;

let uluru = {}//My global variables for this script 

//File extension check is done in HTML in input field using "accept="image/*", which is allowing to use only images for upload
//You can also set particular extensions, if you need (png,gif etc). But you can see that it is possible to upload only pictures

function start () {
  searching()
  addEventListener()
}

function prepareList () { // This is done to reset the properties of previous photos. It is done when: 
  //1) Picture is removed from the page
  //2) When picture is reuploaded without remove button click
  photoPreview.setAttribute("src", "");
  photoId.innerHTML = '';
  photoSize.innerHTML = '';
  pictureGPS.innerHTML = '';
  photoPreviewBlock.style.display = "none"
}

function searching() { //Here we're searching for all necessary elements on my page
  photoUpload = document.getElementById("photo");
  photoPreviewBlock=document.querySelector(".photo-preview-block")
  photoPreview = document.querySelector(".photo-preview");
  photoId = document.getElementById("photo-name")
  photoSize = document.getElementById("photo-size")
  pictureRemoveButton = document.getElementById("picture-remove")
  pictureGPS = document.getElementById("geo")
  mapMarker = document.getElementById("google-map")
  errorGPS = document.querySelector(".error-gps")
  errorSize = document.querySelector(".error-size")
}

function addEventListener () {
  pictureRemoveButton.addEventListener("click", removePhoto)
  photoUpload.addEventListener("change", addPhoto)
  // pictureGPS.addEventListener('DOMSubtreeModified',initMap) //initMap function will start only when gpd data from picture will be added to the div element 
}


function addPhoto () {
  prepareList (); 
  file = this.files[0];
  photoSizeMb =(file.size/1024/1024).toFixed(2) //Convert size from bytes to megabytes and round it
  photoCheck (file) 
}

function photoCheck (file) {
  if (file) {
    reader = new FileReader();
    reader.addEventListener("load", function () {
      if (file.size>1024*1024) {
        prepareList ()
        errorSize.style.display="block"
        errorGPS.style.display="none";
        mapMarker.style.display="none" 
      } 

      else if (file.size<1024*1024) { //Checking if upoloaded file's size > 1 MB, if not => check complete and we can add photo's properties   
      errorSize.style.display="none";
      errorGPS.style.display="none";
      photoPreviewBlock.style.display = "block"
      photoPreview.setAttribute("src", this.result)
      photoId.innerHTML += ` ${file.name}`
      photoSize.innerHTML += ` ${photoSizeMb} MB`
      pictureRemoveButton.style.display="block";
      CheckGPS(file)
      } 
    })
  }
  reader.readAsDataURL(file);
}

function CheckGPS (file) {
  mapMarker.style.display="block"
  EXIF.getData (file, function (){ 
    long = EXIF.getTag(this, 'GPSLongitude');
    lati = EXIF.getTag(this, 'GPSLatitude');
         
      function toDecimal (number) {
        if (number===undefined) { 
          prepareList ()
          errorSize.style.display="none";
          mapMarker.style.display="none"
          errorGPS.style.display="block" 
        } 
        else (number) 
          return number[0].numerator + number[1].numerator /
          (60 * number[1].denominator) + number[2].numerator / (3600 * number[2].denominator); 
                  
      };

    longDecimal = toDecimal(long).toFixed(6)
    latiDecimal = toDecimal (lati).toFixed(6)
    pictureGPS.innerHTML += ` ${longDecimal} / ${latiDecimal}`
    uluru.lat = latiDecimal
    uluru.lng = longDecimal

    initMap(longDecimal,latiDecimal)   
  })
}
  //Passing gps data obtained from previous function. I'm 100% sure it's not the best solution, but that's what I've come with ¯\_(ツ)_/¯ 


function initMap(longDecimal,latiDecimal) {
  if(long && lati) {
    uluru.lat = Number(latiDecimal)
    uluru.lng = Number(longDecimal)
    position = {lat: uluru.lat, lng: uluru.lng}
      map = new google.maps.Map(
        document.getElementById('google-map'), {zoom: 15, center: position});
        marker = new google.maps.Marker({position: position, map: map});  
  } else {}
}

function removePhoto () { //This function hides block with photo and photo's information + reset all variables for future uploads 
  prepareList ()
  initMapReset () /*This function will keep GPS data for deleted photo, but will remove marker. 
  Marker will appear only when a proper photo (size<1mb and gps is available)*/
}

function initMapReset () {
  uluru.lat = Number(latiDecimal)
  uluru.lng = Number(longDecimal)
  position = {lat: uluru.lat, lng: uluru.lng}
  map = new google.maps.Map(
    document.getElementById('google-map'), {zoom: 0, center: position});
}

document.addEventListener('DOMContentLoaded',start) //Let's wait fot the entire page tp be loaded and then execute the code



