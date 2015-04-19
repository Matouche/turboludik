/*
########################### TURBOLUDIK #############################
This is a JS script for telling interactive stories that mix texts,
pictures, videos, and sounds. It allows creators to focus on writing
and visual quality rather than code.
                                                Mathis Dubrul (2015)
                                          GNU General Public License
*/
/*global alert*/
/*global markdown*/
(function () {
    "use strict";
    
    /******************** Popups ***********************/
    function newpopup(title, content, wait) {
        var popup = document.createElement('div');
        popup.innerHTML = '<h1>' + title + '</h1>';
        if (wait === true) { //Circles animation
            popup.innerHTML += '<div class="circles"><span class="circle"></span><span class="circle"></span><span class="circle"></span></div>';
        }
        popup.innerHTML += '<p>' + content + '</p>';
        popup.setAttribute('class', 'popup');
        popup.style.opacity = 0;
        document.body.appendChild(popup);
        //slow animation (appearence)
        setTimeout(function () {
            popup.style.opacity = 1;
        }, 1000);
        return popup;
    }
    function closepopup(popup) {
        popup.style.opacity = 0;
        //Remove the node after the smooth deasapearence
        setTimeout(function () {
            popup.parentNode.removeChild(popup);
        }, 1000);
    }
    
    
    /****************** Load a step *******************/
    function load(step, story) {
        var popup, section;
        popup = newpopup('Please wait',
                         'Loading in progress.…',
                         true);
        if (typeof story[step] === 'object') {
            /*Create a new section*/
            section = document.createElement('section');
            section.setAttribute('class', 'step');
            section.setAttribute('id', step);
            
            /*loading text*/
            if (typeof story[step].text === 'string') {
                section.innerHTML =
                    markdown.toHTML(story[step].text);
            }
            closepopup(popup);
            document.body.appendChild(section);
        } else {
            closepopup(popup);
            popup = newpopup('Error !',
                         'There is no step called <code>' +
                             step + '</code>.',
                         false);
        }
    
    }
    
    
    /********************* Init *********************/
    function init() {
        var story, req = new XMLHttpRequest(), popup, step;
        
        closepopup(document.getElementById('home-popup'));
        popup = newpopup('Please wait',
                         'Loading in progress…',
                         true);
        
        //Ajax
        req.open("GET", 'story.json', true);
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                //When we got the file, we try to parse it
                try {
                    story = JSON.parse(req.responseText);
                    if (typeof story.title === 'string') {
                        document.title =
                            story.title + ' - turboludik';
                    }
                    
                    //Looking for changes in #anchors
                    window.setInterval(function () {
                        if (location.hash !== '#' + step) {
                            //Update step value
                            step = location.hash.substr(1,
                                    location.hash.length);
                            //Then call load() function
                            closepopup(popup);
                            load(step, story);
                        }
                    },
                        100);
                    if (location.hash === '') {
                        //The first step is always called 'home'
                        location.hash = '#home';
                    }
                } catch (e) {
                    //If we can't parse the 'story.json' file
                    closepopup(popup);
                    popup = newpopup('Error !',
                                     '<code>' + e + '</code>',
                                     false);
                }
            }
        };
        req.send(null);
    }
    
    
    
    init();
}());