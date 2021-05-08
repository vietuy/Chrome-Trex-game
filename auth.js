// listen for auth status changes

auth.onAuthStateChanged(async user  => {
    if (user) {
      $("#root").append(`    <div id = "gameb">
      <button class = "newgame"> New game</button> 
      </div>`)
      $("#root").after(`<button class="btn btn-light" onclick="swapStyle('style.css')">Light Mode</button>
      <button class="btn btn-dark" onclick="swapStyle('dark.css')">Dark Mode</button>`);
      let token = await getToken();
      let json = await getspotify(token);
      let reddit = await getreddit();
      $("#root").after("<p id = instruction >Game instruction: Press the up-arrow key to jump over the cactus.</p>");
      $("#reddit").append(reddit);
      $("#spotify").append(json);
      setupUI(user);
    } else {
      $("#root").html('');
      $("#spotify").html('');
      $("#reddit").html('');
      $("#instruction").remove();
      $("[class = 'btn btn-light']").remove();
      $("[class = 'btn btn-dark']").remove();
      setupUI(user);
    }
})

const getToken =  async () => {
  const clientId = '93aad2cdb8d5414e98068dc98699c187';
  const clientSecret = 'e1a7a74309cd4131ae24419461e14282';
  const result = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
          'Content-Type' : 'application/x-www-form-urlencoded', 
          'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
      },
      body: 'grant_type=client_credentials'
  });
  const data = await result.json();
  return data.access_token;
}
async function getspotify(token) {
  const result = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?country=US`, {
    method: 'GET',
    headers: { 'Authorization' : 'Bearer ' + token}
  });
  const data = await result.json();
    let answer = `<p>Top daily featured playlist from Spotify you should listen when playing: </p>`;
    for(let i = 0; i <data.playlists.items.length;i++) {
      answer += `<li><a href = "${data.playlists.items[i].external_urls.spotify}" target="_blank"> ${data.playlists.items[i].description}</a></li>`;
    }
  return answer;
}

async function getreddit() {
  const result = await fetch('https://www.reddit.com/r/TRexRunner.json',{
    method: 'GET',
  });
  const data = await result.json();
  let answer = `<p>Newest post from r/Trex Runner:</p>`;
    for(let i = 0; i < data.data.children.length;i++) {
      let redditlink = "https://reddit.com" + data.data.children[i].data.permalink;
      answer += `<li><a href = redditlink target = _blank> ${data.data.children[i].data.title} </a></li>`;
    }
    return answer;
}
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector('.error').innerHTML = ''
  }).catch(err => {
    signupForm.querySelector('.error').innerHTML = err.message;
  });
});

const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
  })
});

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    loginForm.querySelector('.error').innerHTML = err.message;
  });
});
