# Portfolio Deployment Guide

This guide provides instructions for deploying your portfolio website to various hosting platforms.

## Deployment Options

### Option 1: Netlify (Recommended)

Netlify offers a free tier with excellent features for personal portfolio sites.

1. **Create a Netlify account**
   - Sign up at [netlify.com](https://www.netlify.com/)

2. **Deploy from Git**
   - Connect your GitHub/GitLab/Bitbucket account
   - Select your portfolio repository
   - Configure build settings (not needed for this static site)
   - Click "Deploy site"

3. **Configure custom domain**
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Enter your domain name
   - Follow DNS configuration instructions

4. **Enable HTTPS**
   - Netlify provides free SSL certificates via Let's Encrypt
   - SSL should be automatically enabled for your site

### Option 2: GitHub Pages

Free hosting directly from your GitHub repository.

1. **Push to GitHub**
   - Create a repository named `username.github.io`
   - Push your portfolio files to the repository

2. **Enable GitHub Pages**
   - Go to repository settings
   - Scroll to "GitHub Pages" section
   - Select the branch to deploy (usually `main`)
   - Save changes

3. **Configure custom domain** (optional)
   - Add a CNAME file to your repository with your domain
   - Update DNS settings with your domain provider
   - Enable HTTPS in the GitHub Pages settings

### Option 3: Vercel

Similar to Netlify with great performance.

1. **Create a Vercel account**
   - Sign up at [vercel.com](https://vercel.com/)

2. **Import your repository**
   - Connect your Git provider
   - Select your portfolio repository
   - Configure project settings
   - Deploy

3. **Custom domain setup**
   - Go to project settings
   - Add your domain
   - Follow DNS configuration instructions

## Post-Deployment Tasks

1. **Verify all links and functionality**
   - Test navigation
   - Test contact form
   - Check resume download
   - Verify mobile responsiveness

2. **Setup analytics**
   - Add your actual Google Analytics ID
   - Verify tracking is working

3. **Test performance**
   - Run Lighthouse audit
   - Test page speed with Google PageSpeed Insights
   - Optimize if scores are below 90

4. **Submit to search engines**
   - Submit sitemap to Google Search Console
   - Verify domain ownership

5. **Monitoring setup**
   - Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
   - Configure alerts for downtime

## Maintenance Plan

1. **Regular updates**
   - Update content monthly
   - Add new projects as completed
   - Refresh technologies and skills as learned

2. **Backup strategy**
   - Keep local copy of all files
   - Use version control (Git)
   - Consider scheduled backups if using a CMS

3. **Security maintenance**
   - Keep dependencies updated
   - Monitor for security advisories
   - Use Content-Security-Policy headers

## Troubleshooting

**Form submission issues**
- Verify EmailJS configuration
- Check console for errors
- Test with different browsers

**Performance problems**
- Optimize images further
- Consider a CDN for assets
- Minimize third-party scripts

**Custom domain not working**
- Verify DNS propagation (can take 24-48 hours)
- Check DNS configuration
- Ensure CNAME is properly set up 