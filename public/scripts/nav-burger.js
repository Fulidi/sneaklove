const navb = () => {

    const btnresponsive = document.querySelector('.burger');

    const nav = document.querySelector('.nav-links');

    const Navlinks = document.querySelectorAll('.nav-links li');

    btnresponsive.addEventListener('click', () => {
        // lancer l'animation //

        btnresponsive.classList.toggle('active');
        nav.classList.toggle('nav-active');
    });

}

navb();