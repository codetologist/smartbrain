import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'

const app = new Clarifai.App({
  apiKey: '35f876034fc54fbe9dde70291778dbe3'
 });

const particlesOptions = {
    particles: {
      line_linked: {
        shadow: {
          enable: true,
          color: "#3CA9D1",
          blur: 5
        }
      }
    }
}

class App extends Component {

  constructor(){
    super();
    this.state ={
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    console.log(width, height);

    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  } 

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then( response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    }else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
    const {isSignedIn, imageURL, route, box} = this.state;
  return (
    <div className="App">
      <Particles className='particles'
        params={particlesOptions}
            />
        { route === 'home' 
          ? <div>
              <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
              <Logo />
              <Rank/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box = {box} imageURL = {imageURL}/>
            </div>
          : (
              route ==="signin" 
              ? 
              <div>
              <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
              <SignIn onRouteChange={this.onRouteChange}/>
              </div>
              : 
              <div>
              <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
              <Register onRouteChange={this.onRouteChange}/>
              </div>
            )
        }
    </div>
  );
}
}

export default App;
