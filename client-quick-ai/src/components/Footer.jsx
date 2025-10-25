import React from 'react'
import {assets} from '../assets/assets'
const Footer = () => {
  return (
    <div className="text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        <div className="max-w-80">
          <img src={assets.logo} alt="logo" className="mb-4 h-8 md:h-9" />
          <p className="text-sm">
            Experience the power o AI with QuickAi. <br /> Transform Your
            content creation with our suitr of premium AI Tools. Write articles,
            generate images, and enhance your workflow.
          </p>
          <div className="flex items-center gap-4 mt-4">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/techoptrack/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <svg className="w-8 h-7" viewBox="0 0 24 24">
                <radialGradient id="ig" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#feda75" />
                  <stop offset="25%" stopColor="#fa7e1e" />
                  <stop offset="50%" stopColor="#d62976" />
                  <stop offset="75%" stopColor="#962fbf" />
                  <stop offset="100%" stopColor="#4f5bd5" />
                </radialGradient>
                <path
                  fill="url(#ig)"
                  d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM12 8.5a3.5 3.5 0 11-3.5 3.5A3.5 3.5 0 0112 8.5zm5-1.25a.75.75 0 11.75-.75.75.75 0 01-.75.75z"
                />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@TechOpTrack"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#FF0000"
                  d="M21.8 8.001a2.752 2.752 0 00-1.94-1.948C18.07 5.75 12 5.75 12 5.75s-6.07 0-7.86.303A2.752 2.752 0 002.2 8.001 28.28 28.28 0 002 12a28.28 28.28 0 00.2 3.999 2.752 2.752 0 001.94 1.948C5.93 18.25 12 18.25 12 18.25s6.07 0 7.86-.303a2.752 2.752 0 001.94-1.948A28.28 28.28 0 0022 12a28.28 28.28 0 00-.2-3.999zM10 14.73V9.27L15.5 12l-5.5 2.73z"
                />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/ChetaN7895"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#171515">
                <path d="M12 0a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6a3.1 3.1 0 00-1.3-1.8c-1.1-.7.1-.7.1-.7a2.4 2.4 0 011.8 1.2 2.4 2.4 0 003.3.9 2.4 2.4 0 01.7-1.5c-2.7-.3-5.6-1.4-5.6-6.2a4.9 4.9 0 011.3-3.4 4.5 4.5 0 01.1-3.4s1-.3 3.4 1.3a11.7 11.7 0 016.2 0c2.4-1.6 3.4-1.3 3.4-1.3a4.5 4.5 0 01.1 3.4 4.9 4.9 0 011.3 3.4c0 4.8-2.9 5.9-5.6 6.2a2.6 2.6 0 01.7 2v3c0 .3.2.7.8.6A12 12 0 0012 0z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/chetan-solanki-66a6842b5/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#0077B5"
                  d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.036-1.852-3.036-1.853 0-2.137 1.447-2.137 2.942v5.663h-3.236V9h3.105v1.561h.043a3.408 3.408 0 013.064-1.68c3.274 0 3.879 2.156 3.879 4.963v6.608zM5.337 7.433a1.875 1.875 0 110-3.75 1.875 1.875 0 010 3.75zm1.617 13.019H3.72V9h3.234v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
                />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <p className="text-lg text-gray-800">COMPANY</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Partners</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-lg text-gray-800">SUPPORT</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Safety Information</a>
            </li>
            <li>
              <a href="#">Cancellation Options</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Accessibility</a>
            </li>
          </ul>
        </div>

        <div className="max-w-80">
          <p className="text-lg text-gray-800">STAY UPDATED</p>
          <p className="mt-3 text-sm">
            Subscribe to our newsletter for inspiration and special offers.
          </p>
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none"
              placeholder="Your email"
            />
            <button className="flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r">
              {/* Arrow icon */}
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <hr className="border-gray-300 mt-8" />
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>
          © {new Date().getFullYear()}{" "}
          <a href="https://www.youtube.com/@TechOpTrack">TechOpTrack</a>. All rights reserved.
        </p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>
            <a href="#">Sitemap</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer
