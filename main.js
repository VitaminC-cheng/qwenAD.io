const sections = Array.from(document.querySelectorAll(".screen"));
const dots = Array.from(document.querySelectorAll(".progress-dot"));
const tokenRail = document.querySelector(".token-rail");
const tokenRailYears = Array.from(document.querySelectorAll(".token-rail-years li"));

function getTokenStage(sectionId) {
  const stageMap = {
    "page-3": 1,
    "page-4": 2,
    "page-5": 3,
    "page-6": 4,
    "page-7": 4,
    "page-8": 4,
    "page-9": 4,
    "page-10": 4
  };

  return stageMap[sectionId] || 0;
}

function updateTokenRail(sectionId) {
  if (!tokenRail) return;

  const stage = getTokenStage(sectionId);
  tokenRail.dataset.stage = String(stage);
  tokenRailYears.forEach((item) => {
    const itemStage = Number(item.dataset.yearStage);
    item.classList.toggle("is-active", itemStage <= stage);
  });
}

function scrollToSection(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindScrollButtons() {
  document.querySelectorAll("[data-target]").forEach((button) => {
    button.addEventListener("click", () => scrollToSection(button.dataset.target));
  });
}

function observeSections() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        dots.forEach((dot) => {
          dot.classList.toggle("is-active", dot.dataset.target === entry.target.id);
        });
        updateTokenRail(entry.target.id);
      });
    },
    { threshold: 0.52 }
  );

  sections.forEach((section) => observer.observe(section));
}

bindScrollButtons();
observeSections();

// 词云初始化
function initWordCloud() {
  const chartDom = document.getElementById("word-cloud");
  if (!chartDom) return;
  
  const myChart = echarts.init(chartDom);
  
  const words = [
    { name: "课件", value: 100 },
    { name: "论文", value: 85 },
    { name: "截图", value: 45 },
    { name: "录音", value: 70 },
    { name: "代码", value: 95 },
    { name: "海报", value: 40 },
    { name: "音频", value: 65 },
    { name: "笔记", value: 80 },
    { name: "作业", value: 55 },
    { name: "文献", value: 75 },
    { name: "真题", value: 78 },
    { name: "PPT", value: 50 },
    { name: "思维导图", value: 88 },
    { name: "实验报告", value: 60 },
    { name: "表格", value: 42 }
  ];
  
  const option = {
    tooltip: {
      show: false
    },
    series: [{
      type: "wordCloud",
      shape: "circle",
      left: "center",
      top: "center",
      width: "90%",
      height: "90%",
      sizeRange: [14, 40],
      rotationRange: [-45, 45],
      rotationStep: 15,
      gridSize: 4,
      drawOutOfBound: false,
      textStyle: {
        fontFamily: "LXGW WenKai, sans-serif",
        fontWeight: 600,
        color: function() {
          const colors = ["#4039c3", "#659efe", "#5e55ee", "rgba(1,1,1,0.72)"];
          return colors[Math.floor(Math.random() * colors.length)];
        }
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: "#333"
        }
      },
      data: words
    }]
  };
  
  myChart.setOption(option);
}

initWordCloud();

// 雷达图初始化
function initRadarChart() {
  const canvas = document.getElementById("radar-chart");
  if (!canvas) return;
  
  // 处理高DPI屏幕
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  
  const labels = ["解析任务要求", "智能分工建议", "生成甘特图", "优化PPT逻辑", "梳理竞赛框架"];
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const radius = 100;
  const sides = labels.length;
  
  let animationProgress = 0;
  let animationStarted = false;
  
  // 绘制雷达图
  function drawRadarChart(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景网格
    ctx.strokeStyle = "rgba(64, 57, 195, 0.2)";
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      const r = (radius / 5) * i;
      for (let j = 0; j <= sides; j++) {
        const angle = (Math.PI * 2 * j) / sides - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // 绘制轴线
    ctx.strokeStyle = "rgba(64, 57, 195, 0.3)";
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      ctx.stroke();
    }
    
    // 绘制数据区域（动画效果）
    const dataRadius = radius * progress;
    ctx.beginPath();
    ctx.fillStyle = "rgba(64, 57, 195, 0.3)";
    ctx.strokeStyle = "rgba(64, 57, 195, 0.8)";
    ctx.lineWidth = 2;
    
    for (let i = 0; i <= sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const x = centerX + dataRadius * Math.cos(angle);
      const y = centerY + dataRadius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 绘制数据点
    ctx.fillStyle = "#4039c3";
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const x = centerX + dataRadius * Math.cos(angle);
      const y = centerY + dataRadius * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 绘制标签
    ctx.fillStyle = "#333";
    ctx.font = "bold 14px LXGW WenKai, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const labelRadius = radius + 30;
      let x = centerX + labelRadius * Math.cos(angle);
      let y = centerY + labelRadius * Math.sin(angle);
      
      // 上方的标签往上移一点
      if (i === 0 || i === 1 || i === 4) {
        y -= 15;
      }
      
      // 特殊调整："解析任务要求"往顶点移近一点
      if (i === 0) {
        y += 15;
      }
      // 特殊调整："梳理竞赛框架"往上移
      if (i === 4) {
        y -= 10;
      }
      // 特殊调整："智能分工建议"往上移10px，往左移5px
      if (i === 1) {
        y -= 10;
        x -= 5;
      }
      
      ctx.fillText(labels[i], x, y);
    }
  }
  
  // 动画函数
  function animate() {
    if (animationProgress < 1) {
      animationProgress += 0.01;
      drawRadarChart(animationProgress);
      requestAnimationFrame(animate);
    } else {
      drawRadarChart(1);
    }
  }
  
  // 使用IntersectionObserver检测是否进入视口
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animationStarted) {
          animationStarted = true;
          animate();
        }
      });
    },
    { threshold: 0.5 }
  );
  
  observer.observe(canvas);
  
  // 初始绘制空雷达图
  drawRadarChart(0);
}

initRadarChart();

// === 互动效果 ===

// 卡片翻转效果
function initFlipCards() {
  const flipCards = document.querySelectorAll(".flip-card");
  flipCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      card.classList.toggle("is-flipped");
    });
  });
}

// 点击动画反馈
function initClickAnimation() {
  const clickElements = document.querySelectorAll(".primary-action, .timeline-node strong, .metric-card strong");
  clickElements.forEach((el) => {
    el.classList.add("click-animate");
    el.addEventListener("click", function() {
      this.classList.add("is-clicking");
      setTimeout(() => {
        this.classList.remove("is-clicking");
      }, 300);
    });
  });
}

// 能力列表点击高亮
function initAbilityListInteraction() {
  const abilityItems = document.querySelectorAll(".ability-list li");
  abilityItems.forEach((item) => {
    item.addEventListener("click", () => {
      abilityItems.forEach((i) => i.classList.remove("is-selected"));
      item.classList.add("is-selected");
    });
  });
}

function initTodoListInteraction() {
  const todoList = document.querySelector("#page-6 .material-stack");
  if (!todoList) return;

  const items = Array.from(todoList.querySelectorAll(":scope > span"));

  const updateCompleteState = () => {
    const isComplete = items.length > 0 && items.every((todoItem) => todoItem.classList.contains("is-selected"));
    const wasComplete = todoList.classList.contains("is-complete");

    todoList.classList.toggle("is-complete", isComplete);

    if (isComplete && !wasComplete) {
      todoList.classList.remove("is-complete");
      void todoList.offsetWidth;
      todoList.classList.add("is-complete");
    }
  };

  items.forEach((item) => {
    item.setAttribute("role", "checkbox");
    item.setAttribute("tabindex", "0");
    item.setAttribute("aria-checked", "false");

    const toggleItem = () => {
      const isSelected = item.classList.toggle("is-selected");
      item.setAttribute("aria-checked", String(isSelected));
      updateCompleteState();
    };

    item.addEventListener("click", toggleItem);
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      toggleItem();
    });
  });
}

// 时间轴节点点击展开
function initTimelineInteraction() {
  const timelineNodes = document.querySelectorAll(".timeline-node");
  timelineNodes.forEach((node) => {
    node.addEventListener("click", () => {
      const year = node.querySelector("strong").textContent;
      const desc = node.querySelector("span").textContent;
      
      // 添加点击反馈
      timelineNodes.forEach((n) => n.classList.remove("is-active-node"));
      node.classList.add("is-active-node");
      
      // 可以在这里添加更多交互，比如跳转到对应页面
      const pageMap = {
        "大一": "page-3",
        "大二": "page-4",
        "大三": "page-5",
        "大四": "page-6"
      };
      
      if (pageMap[year]) {
        scrollToSection(pageMap[year]);
      }
    });
  });
}

// 初始化所有互动效果
initFlipCards();
initClickAnimation();
initAbilityListInteraction();
initTodoListInteraction();
initTimelineInteraction();
initBatteryInteraction();

// 电池互动效果
function initBatteryInteraction() {
  const batteryFill = document.getElementById("battery-fill");
  const batteryPercent = batteryFill?.querySelector(".battery-percent");
  const batteryInteractive = document.querySelector(".battery-interactive");
  const chipItems = document.querySelectorAll(".chip-item");
  
  if (!batteryFill || !chipItems.length) return;
  
  const totalChips = chipItems.length;
  let completedCount = 0;
  let isComplete = false;
  
  chipItems.forEach((chip) => {
    chip.addEventListener("click", () => {
      if (isComplete || chip.classList.contains("is-active") || chip.classList.contains("is-done")) return;

      chip.classList.add("is-active");

      setTimeout(() => {
        chip.classList.remove("is-active");
        chip.classList.add("is-done");
        completedCount = Math.min(completedCount + 1, totalChips);
        updateBattery();
      }, 200);
    });
  });
  
  function updateBattery() {
    const percent = Math.round((completedCount / totalChips) * 100);
    batteryFill.style.width = percent + "%";
    if (batteryPercent) {
      batteryPercent.textContent = percent + "%";
    }
    
    if (completedCount === totalChips) {
      isComplete = true;
      batteryFill.style.background = "linear-gradient(90deg, #17320b, #095d40, #18795b, #43b14b, #c1ff72, #e8ffb7)";
      chipItems.forEach((chip) => chip.classList.add("is-locked"));
      batteryInteractive?.classList.remove("is-complete");
      void batteryInteractive?.offsetWidth;
      batteryInteractive?.classList.add("is-complete");
    }
  }
}

function initBrandReveal() {
  const brandPair = document.querySelector(".brand-pair");
  const qwenButton = document.querySelector(".qwen-logo-button");
  if (!brandPair || !qwenButton) return;

  qwenButton.addEventListener("click", () => {
    brandPair.classList.toggle("is-token-visible");
  });
}

initBrandReveal();

document.querySelectorAll("[data-url]").forEach((button) => {
  button.addEventListener("click", () => {
    window.location.href = button.dataset.url;
  });
});
