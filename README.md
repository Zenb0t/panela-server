[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
# Panela's Backend

This is the backend for the Panela project, where you can manage recipes and calculate their costs based on the ingredients.

## About The Project

[![Panela Screen Shot][product-screenshot]](https://panela.app)

Build using Node.js + Express, Mongoose and MongoDB. This project uses Auth0 to provide an authentication pipeline and exposes a RestFUL API designed from scratch. It's deployed to a droplet on DigitalOcean, along with a CD/CI pipeline.

This project is a complete app, build from the ground up, from conception to design and implementation. Some challenges faced during implementation have been defining the data schemas and maintaing the database consistent when they change. Another obstacle was managing the users without using Auth0 endpoints, as I'm cheap and don't want to pay :smirk:. I'm using a Hashmap to keep track of users, to create a quick lookup table to reduce querying the db.

You can see a live demo at https://panela.app

## Contact

Felipe Ribeiro -  zazen.coding@gmail.com

Check also the frontend here: [https://github.com/Zenb0t/frontend-recipes](https://github.com/Zenb0t/frontend-recipes)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[issues-shield]: https://img.shields.io/github/issues/Zenb0t/frontend-recipes.svg?style=for-the-badge
[issues-url]: https://github.com/Zenb0t/frontend-recipes/issues
[license-shield]: https://img.shields.io/github/license/Zenb0t/frontend-recipes.svg?style=for-the-badge
[license-url]: https://github.com/Zenb0t/frontend-recipes/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/felipe-ribeiro-245a37192/
[product-screenshot]: https://feliperibeiro.ca/static/media/panela.3155b4af686073f76807.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
