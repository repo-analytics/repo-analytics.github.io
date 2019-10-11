var refreshIntervalId = setInterval(() => {
  const buyBtn = document.querySelector('.buybtn:not(.disabled)');
  console.log(buyBtn)
  if (buyBtn) {
    console.log('按');
    buyBtn.click();
    clearInterval(refreshIntervalId);
  } else {
    console.log('没有这个按钮');
  }
}, 5);
