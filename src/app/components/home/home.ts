import {
  Component,
  HostListener,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  tech: string[];
}

interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
}

interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

interface Service {
  icon: string;
  title: string;
  description: string;
}

interface Blog {
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  url: string;
}

interface Testimonial {
  text: string;
  name: string;
  role: string;
  avatar: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  encapsulation: ViewEncapsulation.None,
})
export class Home implements AfterViewInit, OnDestroy {

  // ── State ──────────────────────────────────────────────────────────────────

  isSticky = false;
  showScrollUp = false;
  isMenuOpen = false;
  currentTyping = '';
  isSubmitting = false;
  submitStatus: 'idle' | 'success' | 'error' = 'idle';
  currentYear = new Date().getFullYear();

  private typingTexts = ['Fullstack Developer.', 'Backend Engineer.', 'Mobile Developer.', 'Problem Solver.'];
  private typingTimeout?: ReturnType<typeof setTimeout>;
  private observer?: IntersectionObserver;

  // ── Data ───────────────────────────────────────────────────────────────────

  experience: Experience[] = [
    {
      role: 'Senior Fullstack Developer',
      company: 'TechNova Solutions Ltd.',
      period: '2022 – Present',
      description:
        'Lead architect for enterprise SaaS products serving 50k+ users. Designed microservices infrastructure, reduced API response times by 40%, and introduced CI/CD pipelines that cut deployment cycles from 2 weeks to 1 day.',
      tech: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL', 'Docker', 'AWS'],
    },
    {
      role: 'Fullstack Developer',
      company: 'Savanna Digital Agency',
      period: '2020 – 2022',
      description:
        'Built and maintained web and mobile applications for clients across fintech, real estate, and e-commerce sectors. Collaborated with cross-functional teams of 8+ engineers in agile sprints.',
      tech: ['Laravel', 'Vue.js', 'Flutter', 'MySQL', 'Firebase'],
    },
    {
      role: 'Junior Software Developer',
      company: 'CodeCraft Kenya',
      period: '2019 – 2020',
      description:
        'Developed internal tools and client-facing dashboards. Gained hands-on experience with RESTful API design, database normalisation, and responsive UI development.',
      tech: ['PHP', 'JavaScript', 'MySQL', 'Bootstrap'],
    },
  ];

  projects: Project[] = [
    {
      title: 'Property Management System',
      category: 'Enterprise Web App',
      description:
        'A comprehensive platform for landlords, property managers, and tenants. Features include lease management, automated rent collection via M-Pesa, maintenance request workflows, financial reporting, and a tenant self-service portal.',
      image: '/images/projects/property.jpg',
      tech: ['Spring Boot', 'Angular', 'PostgreSQL', 'M-Pesa API', 'Docker'],
      liveUrl: '',
      githubUrl: '',
    },
    {
      title: 'Car Rental System',
      category: 'Full-Stack Platform',
      description:
        'End-to-end vehicle rental platform with real-time fleet availability and online booking. Vehicle management, driver assignment, damage reporting, and analytics dashboards.',
      image: '/images/projects/carrental.jpg',
      tech: ['Laravel', 'MySQL'],
      liveUrl: '',
      githubUrl: '',
    },
    {
      title: 'E-Commerce Website',
      category: 'Commerce Solution',
      description:
        'A scalable marketplace with product catalogue management, cart & wishlist, and order tracking',
      image: '/images/projects/ecommerce.jpg',
      tech: ['JavaScript', 'HTML', 'CSS'],
      liveUrl: '',
      githubUrl: '',
    },
  ];

  skillCategories: SkillCategory[] = [
    {
      name: 'Backend',
      icon: 'fas fa-server',
      skills: ['Java', 'Spring Boot', 'PHP', 'Laravel', 'Node.js', 'Express','REST APIs', 'Microservices'],
    },
    {
      name: 'Frontend',
      icon: 'fas fa-desktop',
      skills: ['Angular', 'JavaScript', 'TypeScript', 'Vue.js', 'HTML', 'CSS', ],
    },
    {
      name: 'Mobile',
      icon: 'fas fa-mobile-alt',
      skills: ['Ionic', 'Firebase', 'REST Integration'],
    },
    {
      name: 'Databases',
      icon: 'fas fa-database',
      skills: ['PostgreSQL', 'MySQL', 'SQL Server'],
    },
    {
      name: 'DevOps & Cloud',
      icon: 'fas fa-cloud',
      skills: ['Docker', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Linux', 'Nginx'],
    },
    {
      name: 'Tools & Practices',
      icon: 'fas fa-tools',
      skills: ['Git', 'Agile/Scrum', 'Jasmine', 'Clean Architecture', 'Postman', 'Swagger'],
    },
  ];

  services: Service[] = [
    {
      icon: 'fas fa-layer-group',
      title: 'Fullstack Development',
      description:
        'End-to-end web application development - from database design and API architecture to pixel-perfect, performant frontends.',
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Development',
      description:
        'Cross-platform iOS and Android apps built with Ionic, integrated with backend services, payments, and real-time features.',
    },
    {
      icon: 'fas fa-database',
      title: 'Database Design',
      description:
        'Scalable, normalised database schemas with query optimisation, indexing strategies, and migration planning.',
    },
    {
      icon: 'fas fa-cloud-upload-alt',
      title: 'API Development',
      description:
        'RESTful and GraphQL APIs with proper authentication, rate limiting, versioning, and comprehensive documentation.',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Technical Consulting',
      description:
        'Architecture reviews, code audits, and technology roadmap planning to set your engineering team up for long-term success.',
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Mentorship & Training',
      description:
        'Structured mentoring for junior developers - code reviews, pair programming, and career guidance.',
    },
  ];

  blogs: Blog[] = [
    {
      title: 'Building Scalable REST APIs with Spring Boot and Clean Architecture',
      category: 'Backend',
      date: 'Jan 12, 2026',
      readTime: '8 min read',
      excerpt:
        'A deep dive into structuring Spring Boot applications using Clean Architecture principles — separating domain logic from infrastructure concerns for long-term maintainability.',
      image: '/images/blogs/spring-boot.jpg',
      url: '',
    },
    {
      title: 'Flutter State Management in 2025: Riverpod vs BLoC vs Provider',
      category: 'Mobile',
      date: 'Dec 5, 2025',
      readTime: '6 min read',
      excerpt:
        'An honest, practical comparison of the three most popular Flutter state management solutions — with real project examples, trade-offs, and a recommendation for different scenarios.',
      image: '/images/blogs/flutter.jpg',
      url: '',
    },
    {
      title: 'Integrating M-Pesa Daraja API with Laravel: A Complete Guide',
      category: 'Fintech',
      date: 'Oct 22, 2025',
      readTime: '10 min read',
      excerpt:
        'Step-by-step walkthrough of integrating Safaricom\'s M-Pesa Daraja API into a Laravel application — covering STK Push, C2B, B2C callbacks, and error handling.',
      image: '/images/blogs/mpesa.jpg',
      url: '',
    },
  ];

  testimonials: Testimonial[] = [
    {
      text: 'Jesse delivered our property management platform on time and beyond expectations. His attention to detail in API design and the overall system architecture saved us significant refactoring costs down the road.',
      name: 'Jimmy Okello',
      role: 'Property Manager',
      avatar: '/images/testimonials/amara.jpg',
    },
    {
      text: 'Working with Jesse felt like having a senior engineer on the team from day one. He didn\'t just write code, he asked the right questions, challenged assumptions, and delivered a product our customers love.',
      name: 'Benard',
      role: 'Founder, PIS Kenya',
      avatar: '/images/testimonials/david.jpg',
    },
    {
      text: 'Our e-commerce platform handles hundreds of transactions daily without a hiccup. Jesse\'s expertise in backend performance and caching strategies made all the difference. Highly recommended.',
      name: 'Hannah',
      role: 'Product Manager, ShopSoko',
      avatar: '/images/testimonials/priya.jpg',
    },
  ];

  formData: FormData = { name: '', email: '', subject: '', message: '' };

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngAfterViewInit(): void {
    this.startTypingEffect(0, 0);
    this.initScrollReveal();
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    if (this.observer) this.observer.disconnect();
  }

  // ── Scroll & Navigation ────────────────────────────────────────────────────

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    this.isSticky = scrollY > 40;
    this.showScrollUp = scrollY > 500;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  // ── Typing Animation ───────────────────────────────────────────────────────

  private startTypingEffect(textIndex: number, charIndex: number): void {
    const text = this.typingTexts[textIndex];

    if (charIndex < text.length) {
      // Type forward
      this.currentTyping = text.substring(0, charIndex + 1);
      this.typingTimeout = setTimeout(
        () => this.startTypingEffect(textIndex, charIndex + 1),
        90
      );
    } else {
      // Pause, then erase
      this.typingTimeout = setTimeout(() => this.eraseTypingEffect(textIndex), 2000);
    }
  }

  private eraseTypingEffect(textIndex: number): void {
    if (this.currentTyping.length > 0) {
      this.currentTyping = this.currentTyping.slice(0, -1);
      this.typingTimeout = setTimeout(() => this.eraseTypingEffect(textIndex), 50);
    } else {
      // Move to next word
      const nextIndex = (textIndex + 1) % this.typingTexts.length;
      this.typingTimeout = setTimeout(
        () => this.startTypingEffect(nextIndex, 0),
        400
      );
    }
  }

  // ── Scroll Reveal ──────────────────────────────────────────────────────────

  private initScrollReveal(): void {
    const targets = document.querySelectorAll(
      '.reveal-up, .reveal-fade, .reveal-left, .reveal-right'
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.style.getPropertyValue('--delay') || '0s';
            el.style.transitionDelay = delay;
            el.classList.add('is-visible');
            this.observer?.unobserve(el); // fire once
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => this.observer?.observe(el));
  }

  // ── Form Submission ────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.isSubmitting) return;

    // Basic client-side guard (Angular template validation handles the rest)
    if (!this.formData.name || !this.formData.email || !this.formData.message) {
      return;
    }

    this.isSubmitting = true;
    this.submitStatus = 'idle';

    // ── Replace this block with your preferred email service ──────────────
    // Option A: EmailJS (client-side, no backend)
    //   emailjs.send('SERVICE_ID', 'TEMPLATE_ID', this.formData, 'PUBLIC_KEY')
    //     .then(() => { ... }).catch(() => { ... });
    //
    // Option B: Your own backend endpoint
    //   fetch('/api/contact', { method: 'POST', body: JSON.stringify(this.formData) })
    //
    // Simulated delay for demonstration:
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitStatus = 'success';
      this.formData = { name: '', email: '', subject: '', message: '' };

      // Auto-reset status banner after 6 s
      setTimeout(() => (this.submitStatus = 'idle'), 6000);
    }, 1500);
    // ─────────────────────────────────────────────────────────────────────
  }
}