// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-05-24
// @description  try to take over the world!
// @match        https://www.xuetangx.com/learn/*
// @author       You
// @match        https://greasyfork.org/zh-CN/scripts/477454-%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC/code
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var playButton
    var observer
    let timer = null;
    console.log('scrip start!');

    function diffTime(timeStr){
        var [time1, time2] = timeStr.split(" / ");
        const [h1, m1, s1] = time1.split(':').map(Number);
        const [h2, m2, s2] = time2.split(':').map(Number);

        const seconds1 = h1 * 3600 + m1 * 60 + s1;
        const seconds2 = h2 * 3600 + m2 * 60 + s2;

        const diff = seconds2 - seconds1;
        console.log('diff = ' + diff);
        return diff;
    }

    function cheakVideo(){
        playButton = document.querySelector('.xt_video_player_big_play_layer');
        if(playButton === null){
            var nextButton = document.querySelector('.next');
            nextButton.click();
            console.log('BplayButton === null');
        }
        else{
            observer.observe(playButton, { attributes: true });
            console.log('BplayButton != null');
            console.log(playButton);
        }
    }

    function setObserver(){
        console.log('Start!');
        playButton = document.querySelector('.xt_video_player_big_play_layer');

        // 监听class变化
        observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // class发生变化时执行的代码
                    console.log('Button class has changed!');
                    if(playButton.classList.contains('pause_show')){
                        console.log('pause_show');
                        var Timestamp = document.querySelector('.xt_video_player_current_time_display').textContent;
                        if(diffTime(Timestamp) < 5){
                            var nextButton = document.querySelector('.next');
                            nextButton.click();
                        }
                    }
                    else{
                        console.log('no pause_show');
                    }
                }
            }
        });
        observer.observe(playButton, { attributes: true });
        window.addEventListener('pushState', function(e) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
                console.log('Double event!');
                setTimeout(function() {
                    cheakVideo();
                    setObserver();
                }, 2000);
            } else {
                timer = setTimeout(function() {
                    console.log('Single event!');
                    setObserver();
                }, 250);
            }
        });

    }

    setTimeout(setObserver, 5000);

})();
