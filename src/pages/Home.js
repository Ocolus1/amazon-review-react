import React, { useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { getAuth } from 'firebase/auth';

const apiUrl = process.env.REACT_APP_API_URL;

function Home() {
	const [asin, setAsin] = useState('');
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showAnalyze, setShowAnalyze] = useState(true);
	const [isBack, setIsBack] = useState(false);

	function isUserSignedIn() {
		return !!getAuth().currentUser;
	}

	const handleAnalyze = async () => {
		if (asin !== '') {
			setLoading(true);
			setShowAnalyze(false);
			setError(null);
			try {
				const response = await fetch(`${apiUrl}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: `asin=${asin}`,
				});

				if (!response.ok) {
					throw new Error(
						`Request failed with status ${response.status}`
					);
				}
				const data = await response.json();
				setLoading(false);
				setShowAnalyze(true);
				if (data.response) {
					setResult({
						response: data.response,
					});
				} else {
					setIsBack(true);
					setResult({
						positives: data.positives
							.split('.')
							.filter((item) => item.trim().length > 0),
						negatives: data.negatives
							.split('.')
							.filter((item) => item.trim().length > 0),
						improvements: data.improvements
							.split('.')
							.filter((item) => item.trim().length > 0),
					});
				}
			} catch (error) {
				console.error('Error al obtener datos del servidor:', error);
				setResult(null);
				setError(error.toString());
				setLoading(false);
				setShowAnalyze(true);
			}
		} else {
			alert('Input your AZIN to continue.');
		}
	};
	const handleDisplay = (key) => {
		if (key === 0) {
			return `Positivas 🚀`;
		} else if (key === 1) {
			return `Negativas 😞`;
		} else {
			return `Mejoras 🦾`;
		}
	}
	return (
		<section
			style={{
				background: '#010A17',
				height: isBack ? '100%' : '100vh',
				width: '100%',
				color: '#fff',
			}}
		>
			<style type="text/css">
				{`
                    .btn-flat {
                        color: #010A17;
                        background: #F5C00B;
                        border-radius: 7px;
                        padding: .5rem 1.1rem;
                    }

                    .btn-flat:hover {
                        color: #010A17;
                        background: #F5C00B;
                    }

                    .form-control, .form-control:focus {
                        width: 300px;
                        background-color: transparent;
                        border: 1px solid #F5C00B;
                        border-radius: 7px;
                        color: #fff;
                    }

                `}
			</style>
			<Container>
				<div className="text-center pt-5">
					<h2
						className="pt-4 pb-2"
						style={{
							fontFamily: 'Playfair',
						}}
					>
						Analizamos por ti las reviews de cualquier producto de
						Amazon
					</h2>

					<p
						style={{
							fontFamily: 'Open Sans',
							fontSize: '24px',
						}}
					>
						Introduzca el ASIN del producto
					</p>
					<div className="d-flex justify-content-center py-4 mt-5">
						<Form.Control
							type="text"
							value={asin}
							onChange={(e) => setAsin(e.target.value)}
							placeholder="BO9Q0TDW78"
						/>
					</div>
					<Button
						variant="flat"
						style={{
							display: showAnalyze ? 'inline-block' : 'none',
						}}
						onClick={() => {
							if (isUserSignedIn()) {
								handleAnalyze();
							} else {
								alert('You need to sign in to continue.');
							}
						}}
					>
						GENERAR
					</Button>
					<div
						id="loader"
						style={{
							display: loading ? 'inline-block' : 'none',
						}}
						className="text-center"
					>
						<Button
							className="loading-btn mb-3"
							type="button"
							disabled
							variant="flat"
						>
							<span
								className="spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true"
							></span>
							Analyzing...
						</Button>
						<p>Analyzing your reviews, this might take a while</p>
					</div>
					<div>{error}</div>
				</div>
			</Container>
			<Container>
				<Row className="mt-4">
					{result && result.response
						? Object.values(result).map((item, key) => {
								return (
									<Col
										xs={12}
										key={key}
										className="d-flex align-items-center justify-content-center"
									>
										<div className=''>
											<div className="container mt-4">
												<h5 className="text-start mt-5 mb-3">
													Sorry! 😞
												</h5>
												<div className="card border-warning mb-4 text-left">
													<div className="card-body text-muted">
														<blockquote className="blockquote mb-0">
															{item}
														</blockquote>
													</div>
												</div>
											</div>
										</div>
									</Col>
								);
						  })
						: result &&
						  Object.values(result).map((items, key) => {
								return (
									<Col xs={12} md={4} key={key}>
										<h2 className="text-white my-3 fw-semibold">
											{handleDisplay(key)}
										</h2>
										<div
											className={`card border-${
												key === 1
													? 'warning'
													: 'success'
											} mb-4 bg-transparent`}
										>
											<div className="card-body text-white">
												<blockquote className="blockquote mb-0">
													{items.map((item, id) => (
														<React.Fragment
															key={id}
														>
															<p className="lh-sm">
																{id + 1}.{' '}
																{item
																	.trim()
																	.replace(
																		/[-]/g,
																		''
																	)
																	.replace(
																		/^(?:\d+\.)?\s*/,
																		''
																	)}
															</p>
														</React.Fragment>
													))}
												</blockquote>
											</div>
										</div>
									</Col>
								);
						  })}
				</Row>
			</Container>
		</section>
	);
}

export default Home;
