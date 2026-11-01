(() => {
  "use strict";

  const DATA = window.CSTI_DATA;
  if (!DATA) {
    throw new Error("CSTI_DATA 未加载");
  }

  const { dimensions, questions, types, config, disclaimer } = DATA;
  const dimensionById = new Map(dimensions.map((dimension, index) => [
    dimension.id,
    { ...dimension, index }
  ]));
  const typeById = new Map(types.map((type) => [type.id, type]));
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const optionById = new Map();

  questions.forEach((question) => {
    question.options.forEach((option) => {
      optionById.set(option.id, { ...option, questionId: question.id });
    });
  });

  const screens = {
    intro: document.getElementById("screenIntro"),
    quiz: document.getElementById("screenQuiz"),
    loading: document.getElementById("screenLoading"),
    result: document.getElementById("screenResult")
  };

  const els = {
    startBtn: document.getElementById("startBtn"),
    brandHome: document.getElementById("brandHome"),
    friendBanner: document.getElementById("friendBanner"),
    backBtn: document.getElementById("backBtn"),
    progressText: document.getElementById("progressText"),
    progressBar: document.getElementById("progressBar"),
    progressFill: document.getElementById("progressFill"),
    questionKicker: document.getElementById("questionKicker"),
    questionHeading: document.getElementById("questionHeading"),
    questionCard: document.getElementById("questionCard"),
    optionsList: document.getElementById("optionsList"),
    quizNote: document.getElementById("quizNote"),
    loadingTitle: document.getElementById("loadingTitle"),
    resultName: document.getElementById("resultName"),
    resultCode: document.getElementById("resultCode"),
    resultTagline: document.getElementById("resultTagline"),
    radarChart: document.getElementById("radarChart"),
    whyLine: document.getElementById("whyLine"),
    analysisHigh: document.getElementById("analysisHigh"),
    analysisLow: document.getElementById("analysisLow"),
    resultDescription: document.getElementById("resultDescription"),
    blindSpotText: document.getElementById("blindSpotText"),
    nextMoveText: document.getElementById("nextMoveText"),
    friendCompare: document.getElementById("friendCompare"),
    friendCompareContent: document.getElementById("friendCompareContent"),
    sharePosterBtn: document.getElementById("sharePosterBtn"),
    shareModal: document.getElementById("shareModal"),
    closeShareBtn: document.getElementById("closeShareBtn"),
    posterImage: document.getElementById("posterImage"),
    posterCanvas: document.getElementById("posterCanvas"),
    nativeShareBtn: document.getElementById("nativeShareBtn"),
    downloadPosterBtn: document.getElementById("downloadPosterBtn"),
    restartBtn: document.getElementById("restartBtn"),
    homeBtn: document.getElementById("homeBtn"),
    resultDisclaimer: document.getElementById("resultDisclaimer"),
    toast: document.getElementById("toast")
  };

  const state = {
    sequence: [],
    optionOrders: {},
    currentIndex: 0,
    answers: {},
    result: null,
    advancing: false,
    loading: false,
    posterBlob: null,
    posterUrl: "",
    lastFocusedBeforeShare: null,
    friendResult: parseSharedResult(window.location.hash)
  };

  let toastTimer = 0;

  function init() {
    validateData();
    els.resultDisclaimer.textContent = disclaimer;
    bindEvents();

    if (state.friendResult) {
      els.friendBanner.hidden = false;
    }
  }

  function validateData() {
    const errors = [];
    const dimensionIds = new Set(dimensions.map((dimension) => dimension.id));
    const seenTypeIds = new Set();

    if (questions.length !== 20) {
      errors.push(`题目数量应为 20，目前为 ${questions.length}`);
    }

    questions.forEach((question) => {
      if (!Array.isArray(question.options) || question.options.length !== 3) {
        errors.push(`${question.id} 必须有三项选项`);
      }
      question.options.forEach((option) => {
        if (!dimensionIds.has(option.dim)) {
          errors.push(`${option.id} 引用了未知维度 ${option.dim}`);
        }
      });
    });

    types.forEach((type) => {
      if (seenTypeIds.has(type.id)) {
        errors.push(`重复的类型 ID：${type.id}`);
      }
      seenTypeIds.add(type.id);

      if (type.id !== "norM") {
        if (type.high.length !== 2) {
          errors.push(`${type.id} 应有两个高维`);
        }
        if (!dimensionIds.has(type.low)) {
          errors.push(`${type.id} 的低维无效`);
        }
        type.high.forEach((dimensionId) => {
          if (!dimensionIds.has(dimensionId)) {
            errors.push(`${type.id} 引用了未知高维 ${dimensionId}`);
          }
        });
      }
    });

    if (errors.length) {
      console.error("CSTI 数据校验失败：", errors);
    }
  }

  function bindEvents() {
    els.startBtn.addEventListener("click", () => startTest());
    els.restartBtn.addEventListener("click", () => startTest());
    els.backBtn.addEventListener("click", goBack);
    els.brandHome.addEventListener("click", handleHome);
    els.homeBtn.addEventListener("click", handleHome);
    els.sharePosterBtn.addEventListener("click", shareToFriend);
    els.nativeShareBtn.addEventListener("click", nativeSharePoster);
    els.downloadPosterBtn.addEventListener("click", downloadPoster);
    els.closeShareBtn.addEventListener("click", closeShareModal);
    els.shareModal.addEventListener("click", (event) => {
      if (event.target === els.shareModal) {
        closeShareModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.shareModal.hidden) {
        closeShareModal();
      }
    });
  }

  function handleHome(event) {
    if (event) {
      event.preventDefault();
    }
    closeShareModal();
    showScreen("intro", false);
    if (state.friendResult) {
      els.friendBanner.hidden = false;
    }
  }

  function showScreen(name, focusHeading = true) {
    Object.entries(screens).forEach(([screenName, element]) => {
      element.hidden = screenName !== name;
    });
    document.body.dataset.screen = name;
    window.scrollTo({ top: 0, behavior: "auto" });

    if (!focusHeading) {
      return;
    }

    const focusTarget = {
      intro: document.getElementById("introTitle"),
      quiz: els.questionHeading,
      loading: els.loadingTitle,
      result: els.resultName
    }[name];

    if (focusTarget) {
      window.requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
    }
  }

  function startTest() {
    const special = questions.filter((question) => question.special);
    const regular = questions.filter((question) => !question.special);
    const shuffledRegular = shuffle([...regular]);
    const specialQuestion = special[0];
    const insertAt = specialQuestion
      ? Math.max(1, Math.floor(Math.random() * shuffledRegular.length))
      : shuffledRegular.length;

    const sequence = [...shuffledRegular];
    if (specialQuestion) {
      sequence.splice(insertAt, 0, specialQuestion);
    }

    state.sequence = sequence;
    state.optionOrders = {};
    sequence.forEach((question) => {
      state.optionOrders[question.id] = question.shuffleOptions === false
        ? [...question.options]
        : shuffle([...question.options]);
    });

    state.currentIndex = 0;
    state.answers = {};
    state.result = null;
    state.advancing = false;
    state.loading = false;
    resetPoster();

    renderQuestion();
    showScreen("quiz", true);
  }

  function renderQuestion() {
    const question = state.sequence[state.currentIndex];
    if (!question) {
      return;
    }

    state.advancing = false;
    els.backBtn.disabled = state.currentIndex === 0;
    els.questionCard.dataset.questionId = question.id;
    els.questionCard.classList.toggle("is-special", Boolean(question.special));
    els.questionKicker.textContent = `第 ${state.currentIndex + 1} 题 / 共 ${state.sequence.length} 题`;
    els.questionHeading.textContent = question.text;
    els.quizNote.textContent = question.special
      ? "这题本身没有答案。选你此刻更想做的那个。"
      : "没有标准答案。选你平时第一反应最接近的那个。";
    els.optionsList.replaceChildren();

    const displayOptions = state.optionOrders[question.id] || question.options;
    displayOptions.forEach((option, index) => {
      const button = document.createElement("button");
      const selected = state.answers[question.id] === option.id;
      button.type = "button";
      button.className = "option-button";
      button.dataset.optionId = option.id;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      if (selected) {
        button.classList.add("is-selected");
      }

      const letter = document.createElement("span");
      letter.className = "option-letter";
      letter.setAttribute("aria-hidden", "true");
      letter.textContent = String.fromCharCode(65 + index);

      const text = document.createElement("span");
      text.className = "option-text";
      text.textContent = option.text;

      button.append(letter, text);
      button.addEventListener("click", () => selectOption(question, option.id));
      els.optionsList.appendChild(button);
    });

    updateProgress();
    window.requestAnimationFrame(() => els.questionHeading.focus({ preventScroll: true }));
  }

  function selectOption(question, optionId) {
    if (state.advancing || state.loading) {
      return;
    }

    state.answers[question.id] = optionId;
    state.advancing = true;
    updateProgress();

    els.optionsList.querySelectorAll(".option-button").forEach((button) => {
      const selected = button.dataset.optionId === optionId;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.disabled = true;
    });
    els.backBtn.disabled = true;

    window.setTimeout(() => {
      if (state.currentIndex >= state.sequence.length - 1) {
        showLoading();
        return;
      }
      state.currentIndex += 1;
      renderQuestion();
    }, config.autoAdvanceMs);
  }

  function goBack() {
    if (state.advancing || state.loading || state.currentIndex === 0) {
      return;
    }
    state.currentIndex -= 1;
    renderQuestion();
  }

  function updateProgress() {
    const done = state.sequence.filter((question) => state.answers[question.id]).length;
    const total = state.sequence.length || 20;
    const ratio = total ? done / total : 0;
    els.progressText.textContent = `${done} / ${total}`;
    els.progressBar.setAttribute("aria-valuenow", String(done));
    els.progressFill.style.transform = `scaleX(${ratio})`;
  }

  function showLoading() {
    if (state.loading) {
      return;
    }
    state.loading = true;
    showScreen("loading", true);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reducedMotion ? 320 : config.loadingMs;

    window.setTimeout(() => {
      state.result = calculateResult(state.answers);
      state.loading = false;
      renderResult(state.result);
      showScreen("result", true);
    }, delay);
  }

  function calculateResult(answers) {
    const offered = Object.fromEntries(dimensions.map((dimension) => [dimension.id, 0]));
    const selected = Object.fromEntries(dimensions.map((dimension) => [dimension.id, 0]));

    questions.forEach((question) => {
      question.options.forEach((option) => {
        offered[option.dim] += 1;
      });
      const optionId = answers[question.id];
      if (optionId) {
        const option = optionById.get(optionId);
        if (option) {
          selected[option.dim] += 1;
        }
      }
    });

    const scores = {};
    dimensions.forEach((dimension) => {
      scores[dimension.id] = offered[dimension.id]
        ? selected[dimension.id] / offered[dimension.id]
        : 0;
    });

    const ranked = dimensions
      .map((dimension) => ({
        id: dimension.id,
        name: dimension.name,
        score: scores[dimension.id],
        index: dimension.index
      }))
      .sort((a, b) => b.score - a.score || a.index - b.index);

    const top = ranked.slice(0, 2);
    const low = ranked[ranked.length - 1];
    const spread = ranked[0].score - low.score;
    const normalType = typeById.get("norM");
    let type = normalType;
    let mode = "flat";

    if (spread >= config.flatRange) {
      const topIds = top.map((item) => item.id).sort((a, b) => {
        return dimensionById.get(a).index - dimensionById.get(b).index;
      });

      const exact = types.find((candidate) => {
        if (!candidate.low) {
          return false;
        }
        const candidateHigh = [...candidate.high].sort((a, b) => {
          return dimensionById.get(a).index - dimensionById.get(b).index;
        });
        return (
          candidate.low === low.id &&
          candidateHigh.length === topIds.length &&
          candidateHigh.every((id, index) => id === topIds[index])
        );
      });

      if (exact) {
        type = exact;
        mode = "exact";
      } else {
        const candidates = types.filter((candidate) => candidate.low);
        const fitted = candidates
          .map((candidate) => {
            const fit =
              scores[candidate.high[0]] * 0.35 +
              scores[candidate.high[1]] * 0.35 +
              (1 - scores[candidate.low]) * 0.30;
            return { type: candidate, fit };
          })
          .sort((a, b) => b.fit - a.fit || a.type.code.localeCompare(b.type.code));

        type = fitted[0].type;
        mode = "nearest";
      }
    }

    return {
      type,
      scores,
      offered,
      selected,
      ranked,
      top,
      low,
      spread,
      mode
    };
  }

  function renderResult(result) {
    const { type, scores, top, low, mode } = result;
    els.resultName.textContent = type.name;
    els.resultName.classList.toggle("is-long", type.name.length >= 10);
    els.resultCode.textContent = type.code;
    els.resultTagline.textContent = type.tagline;

    els.resultDescription.replaceChildren();
    type.description.forEach((sentence) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = sentence;
      els.resultDescription.appendChild(paragraph);
    });

    els.analysisHigh.textContent = `${top[0].name} + ${top[1].name}`;
    els.analysisLow.textContent = low.name;
    els.blindSpotText.textContent = type.blindSpot;
    els.nextMoveText.textContent = getNextMove(low.id);
    renderRadar(scores);

    if (mode === "flat") {
      els.whyLine.textContent =
        "这次八维位置比较接近，没有哪两维稳定抢麦，也没有一维明显掉队，因此归入“无短板之人”。";
    } else {
      els.whyLine.textContent =
        `这次更常动用「${top[0].name} + ${top[1].name}」，最少出现「${low.name}」，` +
        `因此匹配到“${type.name}”。`;
    }

    renderFriendCompare(result);
    updateAddressBar(result);
  }

  function renderRadar(scores) {
    const size = 400;
    const center = size / 2;
    const radius = 128;
    const labelRadius = 166;
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("class", "radar-svg");
    svg.setAttribute("role", "img");
    svg.setAttribute(
      "aria-label",
      dimensions
        .map((dimension) => `${dimension.name}：${relativeScoreLabel(scores[dimension.id])}`)
        .join("，")
    );

    const pointAt = (index, ratio) => {
      const angle = -Math.PI / 2 + index * (Math.PI / 4);
      return {
        x: center + radius * ratio * Math.cos(angle),
        y: center + radius * ratio * Math.sin(angle)
      };
    };

    const outerPoints = dimensions
      .map((_, index) => {
        const point = pointAt(index, 1);
        return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
      })
      .join(" ");
    const backdrop = document.createElementNS(svgNamespace, "polygon");
    backdrop.setAttribute("points", outerPoints);
    backdrop.setAttribute("class", "radar-backdrop");
    svg.appendChild(backdrop);

    [0.25, 0.5, 0.75, 1].forEach((level) => {
      const points = dimensions
        .map((_, index) => {
          const point = pointAt(index, level);
          return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
        })
        .join(" ");
      const ring = document.createElementNS(svgNamespace, "polygon");
      ring.setAttribute("points", points);
      ring.setAttribute("class", level === 1 ? "radar-grid radar-outer" : "radar-grid");
      svg.appendChild(ring);
    });

    dimensions.forEach((dimension, index) => {
      const end = pointAt(index, 1);
      const axis = document.createElementNS(svgNamespace, "line");
      axis.setAttribute("x1", String(center));
      axis.setAttribute("y1", String(center));
      axis.setAttribute("x2", end.x.toFixed(2));
      axis.setAttribute("y2", end.y.toFixed(2));
      axis.setAttribute("class", "radar-axis");
      svg.appendChild(axis);

      const labelPoint = pointAt(index, labelRadius / radius);
      const angle = -Math.PI / 2 + index * (Math.PI / 4);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const anchor = Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end";
      const dy = sin > 0.6 ? 14 : sin < -0.6 ? -4 : 5;

      const label = document.createElementNS(svgNamespace, "text");
      label.setAttribute("x", labelPoint.x.toFixed(2));
      label.setAttribute("y", labelPoint.y.toFixed(2));
      label.setAttribute("text-anchor", anchor);
      label.setAttribute("dy", String(dy));
      label.setAttribute("class", "radar-label");
      label.textContent = dimension.name;
      svg.appendChild(label);
    });

    const areaPoints = dimensions.map((dimension, index) => {
      const point = pointAt(index, scores[dimension.id]);
      return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
    });
    const area = document.createElementNS(svgNamespace, "polygon");
    area.setAttribute("points", areaPoints.join(" "));
    area.setAttribute("class", "radar-area");
    svg.appendChild(area);

    dimensions.forEach((dimension, index) => {
      const point = pointAt(index, scores[dimension.id]);
      const dot = document.createElementNS(svgNamespace, "circle");
      dot.setAttribute("cx", point.x.toFixed(2));
      dot.setAttribute("cy", point.y.toFixed(2));
      dot.setAttribute("r", "4");
      dot.setAttribute("class", "radar-dot");
      svg.appendChild(dot);
    });

    els.radarChart.replaceChildren(svg);
  }

  function relativeScoreLabel(score) {
    if (score < 0.25) return "较少出现";
    if (score < 0.4) return "偶尔出现";
    if (score < 0.55) return "中等出现";
    if (score < 0.7) return "较常出现";
    return "经常出现";
  }

  function getNextMove(dimensionId) {
    const nextMoves = {
      insight: "先问这件事到底在解决什么，再补细节。",
      reason: "先把已知事实和猜测分开放，别急着串完整故事。",
      self: "先停十秒，问自己到底想保住什么。",
      people: "别急着解释全部，先看对方一个具体反应。",
      empathy: "先复述一遍对方的处境，再做自己的判断。",
      decision: "先给一个临时答案，允许自己之后修改。",
      flex: "先准备一个不改变目标的小备选方案。",
      calibrate: "先补一条新信息，再决定要不要继续相信当前判断。"
    };
    return nextMoves[dimensionId] || "先换一个角度，再继续判断。";
  }

  function renderFriendCompare(myResult) {
    const friend = state.friendResult;
    if (!friend) {
      els.friendCompare.hidden = true;
      return;
    }

    const friendType = typeById.get(friend.typeId);
    if (!friendType) {
      els.friendCompare.hidden = true;
      return;
    }

    const myTopIds = new Set(myResult.ranked.slice(0, 3).map((item) => item.id));
    const friendRanked = dimensions
      .map((dimension) => ({
        id: dimension.id,
        name: dimension.name,
        score: friend.scores[dimension.id],
        index: dimension.index
      }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
    const friendTopIds = new Set(friendRanked.slice(0, 3).map((item) => item.id));
    const sharedDimensions = dimensions.filter(
      (dimension) => myTopIds.has(dimension.id) && friendTopIds.has(dimension.id)
    );

    const gap = dimensions
      .map((dimension) => ({
        dimension,
        gap: Math.abs(myResult.scores[dimension.id] - friend.scores[dimension.id]),
        mine: myResult.scores[dimension.id],
        friend: friend.scores[dimension.id]
      }))
      .sort((a, b) => b.gap - a.gap)[0];

    const lines = [];
    if (myResult.type.id === friend.typeId) {
      lines.push(
        "<strong>你们连类型都撞了。</strong> 一个已经够热闹，两个凑在一起就是双份脑内连续剧。"
      );
    } else {
      lines.push(
        `你的类型是 <strong>${escapeText(myResult.type.name)}</strong>，朋友的是 ` +
        `<strong>${escapeText(friendType.name)}</strong>。`
      );
    }

    if (sharedDimensions.length) {
      lines.push(
        `你们最像：都把 <strong>${escapeText(sharedDimensions[0].name)}</strong> 放在比较靠前的位置。`
      );
    } else {
      lines.push("你们最像：最高维完全不撞，聊起来像两档节目抢一个遥控器。");
    }

    if (gap && gap.gap > 0) {
      const direction = gap.mine > gap.friend
        ? "你这次更常先动用它，朋友更少让它上场。"
        : "朋友这次更常先动用它，你更少让它上场。";
      lines.push(
        `你们最不像：<strong>${escapeText(gap.dimension.name)}</strong>。${direction}不是谁更会，只是排班不同。`
      );
    }

    els.friendCompareContent.replaceChildren();
    const grid = document.createElement("div");
    grid.className = "compare-grid";
    lines.forEach((html) => {
      const line = document.createElement("p");
      line.className = "compare-line";
      line.innerHTML = html;
      grid.appendChild(line);
    });
    els.friendCompareContent.appendChild(grid);
    els.friendCompare.hidden = false;
  }

  function parseSharedResult(hash) {
    if (!hash || !hash.startsWith("#r=")) {
      return null;
    }
    try {
      const payload = decodeURIComponent(hash.slice(3));
      const [version, typeId, scoreString] = payload.split(".");
      if (version !== config.mapVersion || !typeId || !scoreString) {
        return null;
      }
      const scoreValues = scoreString.split("-").map(Number);
      if (
        scoreValues.length !== dimensions.length ||
        scoreValues.some((value) => !Number.isInteger(value) || value < 0 || value > config.maxScore)
      ) {
        return null;
      }
      const type = typeById.get(typeId);
      if (!type) {
        return null;
      }
      return {
        typeId,
        scores: Object.fromEntries(
          dimensions.map((dimension, index) => [
            dimension.id,
            scoreValues[index] / config.maxScore
          ])
        )
      };
    } catch (error) {
      return null;
    }
  }

  function buildSharedPayload(result) {
    const scoreValues = dimensions.map((dimension) => {
      return Math.max(0, Math.min(config.maxScore, Math.round(result.scores[dimension.id] * config.maxScore)));
    });
    return `${config.mapVersion}.${result.type.id}.${scoreValues.join("-")}`;
  }

  function getShareUrl(result = state.result) {
    if (!result) {
      return window.location.href.split("#")[0];
    }
    const base = window.location.href.split("#")[0];
    return `${base}#r=${encodeURIComponent(buildSharedPayload(result))}`;
  }

  function updateAddressBar(result) {
    try {
      window.history.replaceState(null, "", getShareUrl(result));
    } catch (error) {
      // Some local file previews do not allow replacing the current URL.
    }
  }

  async function shareToFriend() {
    if (!state.result) {
      return;
    }

    const originalLabel = els.sharePosterBtn.textContent;
    els.sharePosterBtn.disabled = true;
    els.sharePosterBtn.textContent = "正在生成海报…";

    try {
      const blob = await generatePoster(state.result);
      openShareModal();

      if (canSharePosterFile()) {
        try {
          await navigator.share(buildPosterShareData());
          showToast("已打开系统分享");
        } catch (error) {
          if (error.name !== "AbortError") {
            showToast("海报已生成，可长按图片保存");
          }
        }
      } else {
        showToast("海报已生成，可长按图片保存");
      }
    } catch (error) {
      console.error(error);
      showToast("海报生成失败，请再试一次");
    } finally {
      els.sharePosterBtn.disabled = false;
      els.sharePosterBtn.textContent = originalLabel;
    }
  }

  function openShareModal() {
    state.lastFocusedBeforeShare = document.activeElement;
    els.posterImage.src = state.posterUrl;
    els.posterImage.alt = `${state.result.type.name}的 CSTI 测试结果海报`;
    els.shareModal.hidden = false;
    document.body.classList.add("is-sharing");
    els.nativeShareBtn.hidden = !canSharePosterFile();
    window.requestAnimationFrame(() => els.closeShareBtn.focus());
  }

  function closeShareModal() {
    if (els.shareModal.hidden) {
      return;
    }
    els.shareModal.hidden = true;
    document.body.classList.remove("is-sharing");
    if (state.lastFocusedBeforeShare instanceof HTMLElement) {
      state.lastFocusedBeforeShare.focus();
    }
  }

  function canSharePosterFile() {
    if (!state.posterBlob || !navigator.share || !navigator.canShare) {
      return false;
    }
    try {
      return navigator.canShare({ files: [posterFile()] });
    } catch (error) {
      return false;
    }
  }

  function posterFile() {
    return new File(
      [state.posterBlob],
      `csti-${state.result.type.code.toLowerCase()}.png`,
      { type: "image/png" }
    );
  }

  function buildPosterShareData() {
    return {
      files: [posterFile()],
      title: `CSTI · ${state.result.type.name}`,
      text: `我测出来是「${state.result.type.name}」：${state.result.type.tagline}`
    };
  }

  async function nativeSharePoster() {
    if (!state.posterBlob) {
      return;
    }
    try {
      await navigator.share(buildPosterShareData());
    } catch (error) {
      if (error.name !== "AbortError") {
        showToast("当前浏览器不支持直接分享，请长按图片保存");
      }
    }
  }

  function downloadPoster() {
    if (!state.posterUrl || !state.result) {
      return;
    }
    const link = document.createElement("a");
    link.href = state.posterUrl;
    link.download = `csti-${state.result.type.code.toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function resetPoster() {
    closeShareModal();
    if (state.posterUrl) {
      URL.revokeObjectURL(state.posterUrl);
    }
    state.posterBlob = null;
    state.posterUrl = "";
    els.posterImage.removeAttribute("src");
  }

  async function generatePoster(result) {
    const qrImage = await loadImage(config.shareQrDataUrl);
    drawPoster(result, qrImage);
    const blob = await canvasToBlob(els.posterCanvas);
    if (!blob) {
      throw new Error("无法生成海报");
    }
    if (state.posterUrl) {
      URL.revokeObjectURL(state.posterUrl);
    }
    state.posterBlob = blob;
    state.posterUrl = URL.createObjectURL(blob);
    return blob;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("二维码图片加载失败"));
      image.src = src;
    });
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  function drawPoster(result, qrImage) {
    const canvas = els.posterCanvas;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const ink = "#171713";
    const paper = "#f2eee4";
    const card = "#fffdf7";
    const acid = "#d7ff3e";
    const hot = "#ff5b37";
    const muted = "#6d675d";
    const titleFont = '"Microsoft YaHei", "PingFang SC", sans-serif';

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(23,23,19,0.045)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 54) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 54) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.fillStyle = ink;
    ctx.fillRect(0, 0, width, 24);
    ctx.fillStyle = acid;
    ctx.fillRect(68, 68, 76, 38);
    ctx.fillStyle = ink;
    ctx.font = `900 21px Consolas, monospace`;
    ctx.fillText("CSTI", 85, 95);
    ctx.fillStyle = muted;
    ctx.font = `700 18px Consolas, monospace`;
    ctx.fillText("CSTI / 本次脑内运行报告", 164, 95);
    ctx.textAlign = "right";
    ctx.fillText("仅供娱乐", width - 68, 95);
    ctx.textAlign = "left";

    ctx.fillStyle = card;
    ctx.fillRect(68, 134, 196, 42);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.strokeRect(68, 134, 196, 42);
    ctx.fillStyle = ink;
    ctx.font = `900 20px Consolas, monospace`;
    ctx.fillText(result.type.code, 87, 163);

    ctx.fillStyle = ink;
    ctx.fillRect(68, 208, 225, 38);
    ctx.fillStyle = acid;
    ctx.font = `800 19px ${titleFont}`;
    ctx.fillText("你的卡住类型是", 86, 235);

    const maxTitleWidth = 940;
    let titleSize = 92;
    ctx.font = `950 ${titleSize}px ${titleFont}`;
    while (ctx.measureText(result.type.name).width > maxTitleWidth && titleSize > 54) {
      titleSize -= 4;
      ctx.font = `950 ${titleSize}px ${titleFont}`;
    }
    const titleLines = wrapCanvasText(
      ctx,
      result.type.name,
      maxTitleWidth,
      titleSize,
      `950 ${titleSize}px ${titleFont}`
    );
    let titleY = 320;
    titleLines.forEach((line) => {
      const metrics = ctx.measureText(line);
      ctx.fillStyle = acid;
      ctx.fillRect(68, titleY - titleSize * 0.9, metrics.width + 20, titleSize * 1.05);
      ctx.fillStyle = ink;
      ctx.fillText(line, 78, titleY);
      titleY += titleSize * 1.08;
    });

    const taglineLines = wrapCanvasText(
      ctx,
      result.type.tagline,
      900,
      34,
      `750 34px ${titleFont}`
    ).slice(0, 2);
    const taglineTop = titleY + 28;
    const taglineHeight = 28 + taglineLines.length * 47;
    ctx.fillStyle = "rgba(255,91,55,0.10)";
    ctx.fillRect(68, taglineTop - 34, 944, taglineHeight);
    ctx.fillStyle = hot;
    ctx.fillRect(68, taglineTop - 34, 8, taglineHeight);
    ctx.fillStyle = ink;
    ctx.font = `750 34px ${titleFont}`;
    let taglineY = taglineTop + 6;
    taglineLines.forEach((line) => {
      ctx.fillText(line, 96, taglineY);
      taglineY += 47;
    });

    ctx.fillStyle = ink;
    ctx.font = `800 18px Consolas, monospace`;
    ctx.fillText("YOUR 8-DIM BRAIN PROFILE", 68, 665);
    drawPosterRadar(ctx, result.scores, width / 2, 875, 126, acid, hot, ink, card);

    ctx.textAlign = "center";
    ctx.fillStyle = ink;
    ctx.font = `850 27px ${titleFont}`;
    ctx.fillText(result.type.shareText, width / 2, 1115);
    ctx.strokeStyle = "rgba(23,23,19,0.3)";
    ctx.beginPath();
    ctx.moveTo(68, 1168);
    ctx.lineTo(width - 68, 1168);
    ctx.stroke();

    const qrSize = 184;
    const qrX = 70;
    const qrY = 1222;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.strokeRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

    ctx.textAlign = "left";
    ctx.fillStyle = ink;
    ctx.font = `950 38px ${titleFont}`;
    ctx.fillText("今天你卡了吗？", 298, 1272);
    ctx.fillStyle = "#5f5a50";
    ctx.font = `650 23px ${titleFont}`;
    ctx.fillText("扫码测测你的脑回路", 298, 1316);
    ctx.fillText("最容易卡在哪里", 298, 1355);
    ctx.fillStyle = acid;
    ctx.fillRect(298, 1390, 218, 34);
    ctx.fillStyle = ink;
    ctx.font = `850 18px ${titleFont}`;
    ctx.fillText("仅供娱乐 · 不是诊断", 314, 1414);

    ctx.textAlign = "center";
    ctx.fillStyle = "#898278";
    ctx.font = `500 15px ${titleFont}`;
    ctx.fillText("本测试由 AI 制作，仅供娱乐，不代表固定人格或真实能力水平", width / 2, 1470);
    ctx.textAlign = "left";
  }

  function drawPosterRadar(ctx, scores, centerX, centerY, radius, acid, hot, ink, card) {
    const pointAt = (index, ratio) => {
      const angle = -Math.PI / 2 + index * (Math.PI / 4);
      return {
        x: centerX + radius * ratio * Math.cos(angle),
        y: centerY + radius * ratio * Math.sin(angle)
      };
    };

    ctx.beginPath();
    dimensions.forEach((_, index) => {
      const point = pointAt(index, 1);
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(215,255,62,0.10)";
    ctx.fill();

    [0.25, 0.5, 0.75, 1].forEach((level) => {
      ctx.beginPath();
      dimensions.forEach((_, index) => {
        const point = pointAt(index, level);
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();
      ctx.strokeStyle = level === 1 ? ink : "rgba(23,23,19,0.22)";
      ctx.lineWidth = level === 1 ? 3 : 1;
      ctx.stroke();
    });

    dimensions.forEach((dimension, index) => {
      const end = pointAt(index, 1);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = "rgba(23,23,19,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const label = pointAt(index, 1.36);
      const angle = -Math.PI / 2 + index * (Math.PI / 4);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ctx.textAlign = Math.abs(cos) < 0.2 ? "center" : cos > 0 ? "left" : "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = ink;
      ctx.font = `800 19px "Microsoft YaHei", "PingFang SC", sans-serif`;
      ctx.fillText(dimension.name, label.x, label.y + (sin > 0.7 ? 8 : 0));
    });

    ctx.beginPath();
    dimensions.forEach((dimension, index) => {
      const point = pointAt(index, scores[dimension.id]);
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(255,91,55,0.34)";
    ctx.strokeStyle = hot;
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();

    dimensions.forEach((dimension, index) => {
      const point = pointAt(index, scores[dimension.id]);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = ink;
      ctx.fill();
      ctx.strokeStyle = card;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  function wrapCanvasText(ctx, text, maxWidth, fontSize, font) {
    ctx.font = font;
    if (ctx.measureText(text).width <= maxWidth) {
      return [text];
    }

    const lines = [];
    let line = "";
    for (const character of text) {
      const test = line + character;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = character;
      } else {
        line = test;
      }
    }
    if (line) {
      lines.push(line);
    }
    return lines;
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("is-visible");
    }, 2200);
  }

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [items[index], items[target]] = [items[target], items[index]];
    }
    return items;
  }

  function escapeText(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  init();
})();
