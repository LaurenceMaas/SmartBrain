import React,{Component} from 'react'

class SignIn extends Component{	
	constructor(props){
		super(props);
		this.state = {
			signInEmail:"",
			signInPassword : "",
			signInOK: true
		}
	}
	
	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value})
	
	}
		
	onPasswordChange= (event) => {
		this.setState({signInPassword: event.target.value})

	}
	
	onSubmitSignIn = () => {
		fetch("http://localhost:3000/signin",{
				method: "post",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
						email: this.state.signInEmail,
						password: this.state.signInPassword
				})
		}).then(response => response.json())
		.then(user => {
			if (user[0].Id) 
			{
				this.props.loadUser(user);
				this.props.onRouteChange("home");	

				
			}else
			{
				document.getElementById("LoginError").innerHTML = user;	
				this.setState({signInOK: false});			
			}		
	
		})		
	
	}
	

	render(){
		const {onRouteChange} = this.props;
		let label;
		
		if (this.state.signInOK === true){
			label = <label id="LoginError" className="db fw6 lh-copy f6"></label>
		}else{
			label = <label id="LoginError" className="db fw6 lh-copy f6">Error logging in</label>
		}
		
	return (
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l shadow-5 mw5 center">
			<main className="pa4 black-80 h-auto">
				<div className="measure">
					<fieldset id="sign_up" className="ba b--transparent ph0 mh0">
					<legend className="f4 fw6 ph0 mh0">Sign In</legend>
						<div className="mt3">
							<label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
							<input 
							className="pa2 input-reset ba bg-transparent hover-bg-transparent hover-transparent w-100 b--black-60" 
							type="email" 
							name="email-address"  
							id="email-address"
							onChange = {this.onEmailChange}
							/>
						</div>
						<div className="mv3">
							<label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
							<input onChange = {this.onPasswordChange}
								className="b pa2 input-reset ba bg-transparent hover-bg-transparent hover-transparent w-100 b--black-60" 
											type="password" 
											name="password"  
											id="password"/>
						</div>
						</fieldset>
						<div className="">
							<input	onClick = {this.onSubmitSignIn}		
							className="b ph3 pv2 shadow-5 input-reset ba b--black bg-transparent grow pointer f6 dib" 
							type="submit" 
							value="Sign in"	/>
						</div>
						<div className="lh-copy mt3">
							<p onClick = {() => onRouteChange("register")} className="f6 link dim black db pointer">Register</p>
						</div>
						<div className="mt3">
							{label}
						</div>						
				</div>
			</main>
		</article>
		);
	}
}
export default SignIn;