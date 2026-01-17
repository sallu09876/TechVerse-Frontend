import { useState, useRef, useEffect, useCallback } from 'react';
import { Container, Row, Col, Button, Card, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductList from '../components/ProductList';
import '../styles/home.css';
import 'animate.css';

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoriesRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

  // Hero video state
  const [activeSlide, setActiveSlide] = useState(0);
  const videoRefs = useRef([]);
  const autoCycleRef = useRef(null);

  // Video titles for each slide
  const videoTitles = [
    { title: "Welcome to TechVerse", subtitle: "Future-Ready Gadgets, Quality Guaranteed" },
    { title: "Latest Tech Arrivals", subtitle: "Discover Cutting-Edge Innovation" },
    { title: "Premium Quality", subtitle: "Engineered for Excellence" },
    { title: "Shop Now", subtitle: "Your Tech Future Starts Here" }
  ];

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handles category selection and navigation
  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    navigate(`/products?category=${encodeURIComponent(catName)}`);
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handles product View click from Home page
  const handleViewProduct = (id) => {
    navigate(`/product/${id}`);
    scrollToTop();
  };

  // Handles newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setShowModal(true);
    setEmail('');
  };

  // Initialize selected category from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(decodeURIComponent(category));
    }
  }, [searchParams]);

  // Switch to next slide - NO PARAMETERS
  const goToNextSlide = useCallback(() => {
    setActiveSlide((prev) => {
      const nextIndex = (prev + 1) % 4;

      // Pause ALL videos first
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });

      // Play ONLY next video
      setTimeout(() => {
        const activeVideo = videoRefs.current[nextIndex];
        if (activeVideo) {
          activeVideo.play().catch(e => console.log('Autoplay blocked:', e));
        }
      }, 100);

      return nextIndex;
    });
  }, []);

  // Go to specific slide by index
  const goToSlide = useCallback((targetIndex) => {
    setActiveSlide(targetIndex);

    // Pause ALL videos first
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Play ONLY target video
    setTimeout(() => {
      const activeVideo = videoRefs.current[targetIndex];
      if (activeVideo) {
        activeVideo.play().catch(e => console.log('Autoplay blocked:', e));
      }
    }, 100);
  }, []);

  // Auto cycle to next video
  const nextSlideAuto = useCallback(() => {
    goToNextSlide();
  }, [goToNextSlide]);

  // Start auto cycle when video starts playing
  const handleVideoStarted = useCallback(() => {
    // Clear previous timeout
    if (autoCycleRef.current) {
      clearTimeout(autoCycleRef.current);
    }

    // Set new timeout for 5 seconds
    autoCycleRef.current = setTimeout(() => {
      nextSlideAuto();
    }, 5000);
  }, [nextSlideAuto]);

  // Mouse move parallax effect
  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 100;
    const y = (clientY / window.innerHeight) * 100;

    const activeVideo = videoRefs.current[activeSlide];
    if (activeVideo) {
      const translateX = (x - 50) * 0.03;
      const translateY = (y - 50) * 0.03;
      activeVideo.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.02)`;
    }
  }, [activeSlide]);

  // Mouse leave reset
  const handleMouseLeave = useCallback(() => {
    const activeVideo = videoRefs.current[activeSlide];
    if (activeVideo) {
      activeVideo.style.transform = 'scale(1) translate(0, 0)';
    }
  }, [activeSlide]);

  // Cleanup auto cycle on unmount
  useEffect(() => {
    return () => {
      if (autoCycleRef.current) {
        clearTimeout(autoCycleRef.current);
      }
    };
  }, []);

  // Initialize first video
  useEffect(() => {
    const initVideo = videoRefs.current[0];
    if (initVideo) {
      initVideo.muted = true;
      initVideo.loop = true;
      initVideo.playsInline = true;
      initVideo.play().catch(e => console.log('Autoplay blocked:', e));
      handleVideoStarted();
    }
  }, [handleVideoStarted]);

  return (
    <div className="home-page">
      {/* Floating Video Hero Section */}
      <section
        className="floating-video-hero"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="hero-carousel-wrapper">
          {/* Video 4 */}
          <article className={`hero-carousel-item ${activeSlide === 3 ? 'active' : ''}`} style={{ zIndex: activeSlide === 3 ? 4 : 1 }}>
            <div className="hero-video-container">
              <video
                ref={el => (videoRefs.current[3] = el)}
                className="hero-video-bg"
                preload="auto"
                onPlay={handleVideoStarted}
                muted
                loop
                playsInline
              >
                <source src="/videos/hero-video-4.mp4" type="video/mp4" />
                <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
              </video>
              <div className="video-overlay"></div>

              <div className="hero-content-wrapper">
                <div className="hero-content">
                  <h1 className="hero-title">{videoTitles[3].title}</h1>
                  <p className="hero-subtitle">{videoTitles[3].subtitle}</p>
                  <div className="hero-cta">
                    <Button as={Link} to="/products" className="hero-btn btn-large">
                      Explore Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Video 3 */}
          <article className={`hero-carousel-item ${activeSlide === 2 ? 'active' : ''}`} style={{ zIndex: activeSlide === 2 ? 4 : 2 }}>
            <div className="hero-video-container">
              <video
                ref={el => (videoRefs.current[2] = el)}
                className="hero-video-bg"
                preload="auto"
                onPlay={handleVideoStarted}
                muted
                loop
                playsInline
              >
                <source src="/videos/hero-video-3.mp4" type="video/mp4" />
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>
              <div className="video-overlay"></div>

              <div className="hero-content-wrapper">
                <div className="hero-content">
                  <h1 className="hero-title">{videoTitles[2].title}</h1>
                  <p className="hero-subtitle">{videoTitles[2].subtitle}</p>
                  <div className="hero-cta">
                    <Button as={Link} to="/products" className="hero-btn btn-large">
                      Explore Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Video 2 */}
          <article className={`hero-carousel-item ${activeSlide === 1 ? 'active' : ''}`} style={{ zIndex: activeSlide === 1 ? 4 : 3 }}>
            <div className="hero-video-container">
              <video
                ref={el => (videoRefs.current[1] = el)}
                className="hero-video-bg"
                preload="auto"
                onPlay={handleVideoStarted}
                muted
                loop
                playsInline
              >
                <source src="/videos/hero-video-2.mp4" type="video/mp4" />
                <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
              </video>
              <div className="video-overlay"></div>

              <div className="hero-content-wrapper">
                <div className="hero-content">
                  <h1 className="hero-title">{videoTitles[1].title}</h1>
                  <p className="hero-subtitle">{videoTitles[1].subtitle}</p>
                  <div className="hero-cta">
                    <Button as={Link} to="/products" className="hero-btn btn-large">
                      Explore Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Video 1 */}
          <article className={`hero-carousel-item ${activeSlide === 0 ? 'active' : ''}`} style={{ zIndex: activeSlide === 0 ? 4 : 4 }}>
            <div className="hero-video-container">
              <video
                ref={el => (videoRefs.current[0] = el)}
                className="hero-video-main"
                preload="auto"
                onPlay={handleVideoStarted}
                muted
                loop
                playsInline
              >
                <source src="/videos/hero-video-1.mp4" type="video/mp4" />
                <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              </video>
              <div className="video-overlay"></div>

              <div className="hero-content-wrapper">
                <div className="hero-content">
                  <h1 className="hero-title">{videoTitles[0].title}</h1>
                  <p className="hero-subtitle">{videoTitles[0].subtitle}</p>
                  <div className="hero-cta">
                    <Button as={Link} to="/products" className="hero-btn btn-large">
                      Explore Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Navigation Dots */}
        <div className="hero-nav">
          <div className="nav-dots">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                className={`dot ${activeSlide === i ? 'active' : ''}`}
                onClick={() => goToSlide(i)}
                type="button"
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="info-section my-5">
        <Container>
          <Row className="align-items-center g-4">
            <Col md={6}>
              <img
                src="/images/profile/profile-1.jpg"
                alt="Quality Tech"
                className="img-fluid rounded shadow"
              />
            </Col>

            <Col md={6}>
              <h3 className="fw-bold mb-3">Premium Quality Technology</h3>
              <p className="text-muted">
                At TechVerse, we bring you cutting-edge gadgets built with precision,
                durability, and performance in mind. Every product is carefully
                selected to meet modern tech standards.
              </p>
              <Button as={Link} to="/products" variant="info">
                Explore Products
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="info-section my-5 bg-light py-5">
        <Container>
          <Row className="align-items-center g-4 flex-md-row-reverse">
            <Col md={6}>
              <img
                src="/images/profile/profile-2.jpg"
                alt="Fast Delivery"
                className="img-fluid rounded shadow"
              />
            </Col>

            <Col md={6}>
              <h3 className="fw-bold mb-3">Fast & Reliable Delivery</h3>
              <p className="text-muted">
                We ensure quick dispatch and secure delivery so your gadgets reach
                you safely and on time. Your convenience is our priority.
              </p>
              <Button as={Link} to="/orders" variant="dark">
                Track Orders
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="promo-section my-5 text-center bg-info text-white py-5 rounded">
        <Container>
          <h2 className="mb-3">Big Sale! Up to 50% OFF</h2>
          <p className="mb-3">Grab your favorite electronics before the stock runs out</p>
          <Button as={Link} to="/products" variant="dark" className="px-4 py-2">
            Shop Now
          </Button>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="featured-products my-5">
        <Container>
          <h2 className="section-title text-center mb-4">Featured Products</h2>
          <Row className="g-4 justify-content-center">
            {products.slice(0, 4).map((product) => (
              <Col key={product.id} xs={12} sm={6} md={3}>
                <Card className="product-card h-100">
                  <div className="product-img-wrapper">
                    <Card.Img variant="top" src={product.image} />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="text-success fw-bold">{product.price}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => handleViewProduct(product.id)}
                      className="mt-auto product-btn"
                    >
                      View
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>


      {/* Categories Section - UNIFORM HEIGHT */}
      <section ref={categoriesRef} className="categories-section my-5">
        <Container>
          <h2 className="section-title text-center mb-4">Shop by Category</h2>
          <Row className="g-3 justify-content-center">
            {categories.map((cat) => (
              <Col xs={8} sm={5} md={3} lg={3} key={cat.id}>
                <Card
                  className={`category-card text-center h-100 ${selectedCategory === cat.name ? 'selected-category' : ''}`}
                  onClick={() => handleCategoryClick(cat.name)}
                  style={{ cursor: 'pointer', height: '100%' }}
                >
                  <div className="category-image-wrapper">
                    <Card.Img variant="top" src={cat.image} className="category-image" />
                  </div>
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <Card.Title>{cat.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Floating Offers Section */}
      <section className="floating-offers my-5">
        <div className="offers-track">
          <div className="offer-item">🔥 Big Sale – Up to 50% OFF</div>
          <div className="offer-item">🚚 Free Delivery on Orders Above ₹999</div>
          <div className="offer-item">⚡ New Arrivals Just Dropped</div>
          <div className="offer-item">💳 Secure Payments & Easy Returns</div>
          <div className="offer-item">🎁 Special Offers for Members</div>

          {/* Duplicate items for seamless loop */}
          <div className="offer-item">🔥 Big Sale – Up to 50% OFF</div>
          <div className="offer-item">🚚 Free Delivery on Orders Above ₹999</div>
          <div className="offer-item">⚡ New Arrivals Just Dropped</div>
          <div className="offer-item">💳 Secure Payments & Easy Returns</div>
          <div className="offer-item">🎁 Special Offers for Members</div>
        </div>
      </section>

      <section className="info-section-center my-5">
        <Container className="text-center">
          <img
            src="/images/profile/profile-3.jpg"
            alt="Trusted Brand"
            className="img-fluid rounded shadow mb-4"
            style={{ maxWidth: "600px" }}
          />

          <h3 className="fw-bold mb-3">Trusted by Thousands</h3>
          <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Thousands of customers trust TechVerse for authentic products,
            transparent pricing, and exceptional support. Join our growing
            community of smart shoppers.
          </p>

          <Button as={Link} to="/signup" variant="info" className="px-4">
            Join TechVerse
          </Button>
        </Container>
      </section>


      {/* Newsletter, Benefits, Testimonials, Modal - SAME AS BEFORE */}
      <section className="newsletter-section my-5 bg-dark text-white py-5">
        <Container className="text-center" id='subscribe'>
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get updates on latest products and exclusive offers</p>
          <Form className="d-flex justify-content-center mt-3" onSubmit={handleSubscribe}>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              style={{ maxWidth: '300px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="info" className="ms-2 px-4">
              Subscribe
            </Button>
          </Form>
        </Container>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered animation>
        <Modal.Body className="text-center py-5">
          <h3 className="mb-3 animate__animated animate__bounceIn">Thank You!</h3>
          <p className="animate__animated animate__fadeInUp mb-0">
            You're in! Exciting updates coming your way
          </p>
          <Button variant="info" className="mt-3" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Home;
