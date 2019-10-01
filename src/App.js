import './App.css';
import Navigation from "./Components/Navigation/Navigation"
import Logo from "./Components/Logo/Logo"
import ImageLinkform from "./Components/ImageLinkform/ImageLinkform"
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition"
import SignIn from "./Components/SignIn/SignIn"
import Register from "./Components/Register/Register"
import Rank from "./Components/Rank/Rank"
import Particles from 'react-particles-js';
import React,{Component} from 'react'


const particleOptions ={
	particles: {
		number: {
			value: 50,
			denisty:{
				enable: true,
				value_area: 800
			}
		}	
	}

}

const initialState ={
	input:"",
	imageurl : "",
	box: {},
	route: "signin", 
	isSignedIn: false,
	user: {						
		id: "" ,
		name:"" ,
		email:"",
		entries: 0,
		joined: ""			
	}
}

class App extends Component
{
	constructor(){
			super();
			this.state = {
				input:"",
				imageurl : "",
				box: {},
				route: "signin", 
				isSignedIn: false,
				user: {						
					id: "" ,
					name:"" ,
					email:"",
					entries: 0,
					joined: ""			
				}
			}
	}
	
	componentDidMount() {
		fetch("http://localhost:3000").then(response => response.json());	
	
	}
	
	loadUser = (data) => {
		this.setState(				
			{
				user: 
				{						
					id: data[0].Id ,
					name:data[0].Name ,
					email:data[0].Email,
					entries: data[0].Entries,
					joined: data[0].Joined			
			
				}
			}
		)
		
	}

	
	calculateFaceLocation = (data) =>{
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById("inputimage");
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol : width-(clarifaiFace.right_col *width),
			bottomRow: height - (clarifaiFace.bottom_row *height)		
		}
		
	}
	
	displayFacebox = (box) =>{		
		this.setState({box:box});
	}
	
	onInputChange= (event) => {
		this.setState({input:event.target.value})
	}
	
	 onButtonSubmit = () => {
		this.setState({imageurl: this.state.input});
		fetch('http://localhost:3000/imageurl', 
		{
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({input: this.state.input})
		})
		.then(response => response.json())
		.then(response => 
		{
			console.log(response.outputs[0])
			if (response) 
			{
				fetch('http://localhost:3000/image', 
				{
					method: 'put',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({id: this.state.user.id})
				})
				.then(response => response.json())
				.then(count => {this.setState(Object.assign(this.state.user, { entries: count[0].Entries}))
				}).catch(err => console.log(err))
			}
			this.displayFacebox(this.calculateFaceLocation(response))
		})
        .catch(err => console.log(err));
	}
	
	onRouteChange = (route) =>{
		if (route === "signout"){
			this.setState(initialState);			
		} else if (route === "home"){
			this.setState({isSignedIn:true})
		}		
		
		this.setState({route: route});
	}
	
	
	render(){
		const {input,imageurl,box,route,isSignedIn} = this.state;

		return (
		<div className="App">
		<Particles className="particles"
		params= {particleOptions}/>		
		<Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange} />		
		{ route === "home" ? 	
			<div>
				<Logo /> 
				<Rank entryCount = {this.state.user.entries} name = {this.state.user.name} />			
				<ImageLinkform 
					onInputChange={this.onInputChange}
					onButtonSubmit = {this.onButtonSubmit}/>
				<FaceRecognition box={box} imageUrl = {this.state.imageurl}/>
			</div>		
			: (			
				this.state.route === "signin"
				? <SignIn loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/> 
				: <Register loadUser={this.loadUser} onRouteChange = {this.onRouteChange}/> 
				)
			
		}			
		</div>
		);
	}
}
export default App;
