import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from 'firebase/auth';
import google from "../google.png"
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function Header() {
	const [user, setUser] = useState(null);
	const [userIdToken, setUserIdToken] = useState(null);

	useEffect(() => {
		// listens to changes in current auth state
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user ? { ...user } : null);
		});

		// removes listener when component is unmounted
		return unsubscribe;
	}, [userIdToken]);

    
	async function handleLogin() {
		const provider = new GoogleAuthProvider();
		const userCredential = await signInWithPopup(auth, provider);
		const idToken = await userCredential.user.getIdToken();
		setUserIdToken(idToken);
		cookies.set('sessionToken', idToken, { path: '/' });
	}

	async function handleLogout() {
		// remove the session token cookie
		cookies.remove('sessionToken', { path: '/' });
		return await signOut(auth);
	}

	return (
		<>
			<style type="text/css">
				{`
                    .navbar-flat {
                        --bs-navbar-color: #010A17;
                        background-color: #010A17;
                        padding: 1rem .5rem;
                        font-family: 'Open Sans';
                    }
                    
                    .navbar-brand {
                        background: linear-gradient(180deg, #FFFFFF 28.65%, rgba(6, 140, 255, 0.59) 48.96%, #FFCA28 70.31%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        text-fill-color: transparent;
                    }

                    .btn-flat {
                        background: #F5C00B;
                        border-radius: 7px;
                        padding: .5rem 2rem;
                        width: 15rem;
                        font-family: 'Open Sans';
                    }

                    .btn-flat:hover {
                        background: #F5C00B;
                    }

                    .navbar-toggler {
                        background-color: #F5C00B;
                    }
                `}
			</style>
			<Navbar collapseOnSelect expand="sm" variant="flat">
				<Container>
					<Navbar.Brand href="#home">AMAZON REVIEW</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto"></Nav>
						<Nav>
							{user ? (
								<div className='d-flex align-items-center justify-content-between '>
									<h3 className='text-white fw-semibold mt-2 me-3'>Welcome, {user.displayName}</h3>
									<Button
										variant="flat"
										onClick={handleLogout}
									>
										Logout
									</Button>
								</div>
							) : (
								<Button
									variant="flat"
									onClick={handleLogin}
									className="mt-4 mt-sm-0"
								>
									<img
										src={google}
										alt="google icon"
										className="googleIcon me-2"
                                        width="24px"
                                        height="24px"
									/>
									Login with Google
								</Button>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
}

export default Header;
