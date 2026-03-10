addListeners();

function addListeners() {

    let stop_obj = null;
    let reset_obj = null;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            reset_obj = animaster().moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stop_obj = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stop_obj.stop();
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            reset_obj.reset();
        });
}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        _steps: [],
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide(element, duration) {
            const moveDuration = duration * 2 / 5;
            const fadeOutDuration = duration * 3 / 5;
            const anim = animaster();

            anim.move(element, moveDuration, {x: 100, y: 20});
            setTimeout(() => {
                anim.fadeOut(element, fadeOutDuration);
            }, moveDuration);

            return {
                reset() {
                    resetMoveAndScale(element)
                    resetFadeOut(element)
                }
            }
        },
        showAndHide(element, duration) {
            const stepDuration = duration / 3;
            const anim = animaster();
            anim.fadeIn(element, stepDuration);

            setTimeout(() => {
                anim.fadeOut(element, stepDuration);
            }, 2 * stepDuration);
        },
        heartBeating(element) {
            let scaled = false;
            const anim = animaster();

            let timerId = setInterval(() => {
                anim.scale(element, 500, scaled ? 1 : 1.4);
                scaled = !scaled;
            }, 500)

            return {
                stop() {
                    clearInterval(timerId);
                }
            }
        },
        addMove(duration, translation) {
            this._steps.push({
                duration,
                translation,
            });
        },
        play(element) {
            let currentTime = 0;
            for (const step of this._steps) {
                setTimeout(() => {
                    this.move(element, step.duration, step.translation)
                }, currentTime);
                currentTime += step.duration;
            }
        }
    }
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
