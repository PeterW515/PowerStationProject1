let playlistKeywordsArea = document.getElementById('playlist-keywords');
let musicContinue = document.getElementById('music-continue-btn');

let client_id = '76df893ec1954a35913752b0bf902564';
let client_secret = '3f2775f60e934f7eb0fc83f3c7d2f497';
let grant_type = 'client_credentials';
let url = 'https://accounts.spotify.com/api/token';
let encodedClientIdClientSecret = btoa(client_id+':'+client_secret);
let authorization = 'Basic ' + encodedClientIdClientSecret;
let token_type;
let access_token;

let myHeaders = new Headers();
//myHeaders.append('Authorization',authorization);
myHeaders.append('Content-Type','application/x-www-form-urlencoded');

let urlencoded = new URLSearchParams();
urlencoded.append('grant_type',grant_type);
urlencoded.append("client_id",client_id);
urlencoded.append("client_secret",client_secret);

let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
};


musicContinue.addEventListener('click',searchKeywords);

function searchKeywords(){
    let keywords = playlistKeywordsArea.value;

    fetch(url,requestOptions)
        .then(response=>response.json())
        .then(result=>getPlaylists(keywords,result));

}


function getPlaylists(keywords,results) {
    let searchQuery = encodeURI(keywords);
    access_token = results.access_token;
    token_type = results.token_type;

    const playlistURL = `https://api.spotify.com/v1/search?q=${searchQuery}&type=playlist&market=US&limit=4`;


    let mySearchHeaders = new Headers();

    mySearchHeaders.append('Content-Type','application/json');
    mySearchHeaders.append('Authorization',`${token_type} ${access_token}`);

    let searchRequestOptions={
        method:'GET',
        headers:mySearchHeaders,
        redirect:'follow'
    };

    fetch(playlistURL,searchRequestOptions)
        .then(response=>response.json())
        .then(result=>displayPlaylists(result));



}

function displayPlaylists(result){
    console.log(result.playlists.items);
    document.getElementById('music-card').innerText='';
    let playlistNameArr = [];
    let playlistImgArr =[];
    //let playlistTracksArr =[];

    // let mySearchHeaders = new Headers();

    // mySearchHeaders.append('Content-Type','application/json');
    // mySearchHeaders.append('Authorization',`${token_type} ${access_token}`);

    // let searchRequestOptions={
    //     method:'GET',
    //     headers:mySearchHeaders,
    //     redirect:'follow'
    // };

    for(let i=0; i<result.playlists.items.length;i++){
        playlistNameArr.push(result.playlists.items[i].name);
        playlistImgArr.push(result.playlists.items[i].images[0].url);

        let playlistDiv = document.createElement('div');
        playlistDiv.className = 'card';
        playlistDiv.setAttribute('style','width:40%;float:left;margin:20px;margin-left:40px;background-color:#4abdac;');

        let playlistImgDiv = document.createElement('div');
        playlistImgDiv.className = 'card-image waves-effect waves-block waves-light';
        playlistImgDiv.setAttribute('style','height:100%;width:100%;')
        playlistDiv.appendChild(playlistImgDiv);

        let playlistImg = document.createElement('img');
        playlistImg.class = 'activator';
        playlistImg.src = result.playlists.items[i].images[0].url;
        playlistImg.setAttribute('style','height:100%;width:100%');
        playlistImgDiv.appendChild(playlistImg);

        let playlistContentCard = document.createElement('div');
        playlistContentCard.className = 'card-content';
        playlistDiv.appendChild(playlistContentCard);

        let titleSpan = document.createElement('span');
        titleSpan.className = 'card-title center-align activator grey-text text-darken-4';
        titleSpan.innerHTML = result.playlists.items[i].name + '<i class=\'material-icons right\'>more_vert</i>';
        playlistContentCard.appendChild(titleSpan);

        let trackDiv = document.createElement('div');
        trackDiv.className = 'card-reveal';
        playlistDiv.appendChild(trackDiv);

        let revealSpan = document.createElement('span');
        revealSpan.className = 'card-title grey-text text-darken-4';
        revealSpan.innerHTML = 'Top 5 Tracks<i class =\'material-icons right\'>close</i>';
        trackDiv.appendChild(revealSpan);

        let trackList = document.createElement('ol');
        trackList.id = 'track-list'+i
        trackDiv.appendChild(trackList);
        getTrackList(result.playlists.items[i]).then(data=>createSampleTrackList(data,i));


        document.getElementById('music-card').appendChild(playlistDiv);



    }


    // for(let i=0; i<result.playlists.items.length;i++){
    //     let plBtn = document.createElement('input');
    //     plBtn.type = 'image';
    //     plBtn.src = result.playlists.items[i].images[0].url;
    //     plBtn.setAttribute('style',`background:${result.playlists.items[i].images[0].url}; width:150px;height:150px;`);


    //     document.getElementById('music-card').appendChild(plBtn);

        // fetch(result.playlists.items[i].tracks.href,searchRequestOptions)
        //     .then(response=>response.json())
        //     .then(data=>console.log(data));
   // }
}

function getTrackList(item){
    let trackURL = item.tracks.href;

    let mySearchHeaders = new Headers();

    mySearchHeaders.append('Content-Type','application/json');
    mySearchHeaders.append('Authorization',`${token_type} ${access_token}`);

    let searchRequestOptions={
        method:'GET',
        headers:mySearchHeaders,
        redirect:'follow'
    };

    return fetch(trackURL,searchRequestOptions).then(response=>response.json());        

}


function createSampleTrackList(data,playlistNum){
    let returnArr =[];
    for(let i=0;i<5;i++){
        returnArr.push('"'+data.items[i].track.name+'" by '+data.items[i].track.artists[0].name);
        let listItem = document.createElement('li');
        listItem.setAttribute('style','color:black;margin:30px;')
        listItem.innerText = returnArr[i];

        let trackList = document.getElementById('track-list'+playlistNum);
        trackList.appendChild(listItem);
        
    }
    
    

}