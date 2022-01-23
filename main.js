// 전역변수 사용 방지를위해 익명함수로 처리
(() => {

  const actions = {
    birdFlies(key) {
      document.querySelector('[data-index="2"] .bird').style.transform = key ? `translateX(${window.innerWidth}px)` : 'translateX(-100%)';
    },
    
    birdFlies2(key) {
      document.querySelector('[data-index="5"] .bird').style.transform = key ? `translate(${window.innerWidth}px, ${-window.innerHeight * 0.7}px)` : 'translateX(-100%)';
    }
  }
  
  const stepElems = document.querySelectorAll('.step');
  const graphicElems = document.querySelectorAll('.graphic-item');
  let currentItem = graphicElems[0]; // 현재 활성화된(visible 클래스가 붙은) .grpahic-item을 지정
  let ioIndex;

  // 눈에 보이는지 사라졌는지 얼마나 올라왔는지 등등 기능이 많음
  const io = new IntersectionObserver((entries, observer) => {
    ioIndex = entries[0].target.dataset.index * 1;
  });
  
  for (let i = 0; i < stepElems.length; i++) {
    // 모든 스텝들이 관찰 대상으로 등록됨
    // 사라지거나 나타날때 콜백함수를 호출함
    io.observe(stepElems[i]);
    // 두가지 방법
    // stepElems[i].setAttribute('data-index', i);
    stepElems[i].dataset.index = i;
    graphicElems[i].dataset.index = i;
  }

  function activate(action) {
    currentItem.classList.add('visible');
    if (action) {
      actions[action](true);
    }
  }

  function inactivate(action) { 
    currentItem?.classList.remove('visible');
    if (action) {
      actions[action](false);
    }
  }

  // Intersection Observer을 이용해서 범위안에 있는 애들만 체크하도록 진행
  window.addEventListener('scroll', () => {
    let step;
    let boundingRect;

    // 현재 화면에 보이는놈과 이전/다음껏 만 처리하겠다.
    // for (let i = 0; i < stepElems.length; i++) {
    for (let i = ioIndex - 1; i < ioIndex + 2; i++) {
      step = stepElems[i];

      if (!step) continue;
      boundingRect = step.getBoundingClientRect(); // 현재아이템의 위치를 출력해줌
      
      // 범위설정
      // 창사이즈의 높이를 기준으로 하면될듯 
      // 윈도우 창사이즈의 10% 보다 크고 80% 작으면
      if (boundingRect.top > window.innerHeight * 0.1 && 
          boundingRect.top < window.innerHeight * 0.8) {

            inactivate(currentItem.dataset.action);
            // 특정 범위에 들어오면 이미지를 보여줌
            currentItem = graphicElems[step.dataset.index]
            activate(currentItem.dataset.action);
      }
    }
  });

  window.addEventListener('load', () => {
    setTimeout(() => scrollTo(0, 0), 100);
  });
  activate();
})();

// 구간을 설정하고 구간에 진입하면 이미지를 변경하는 순서로 진행