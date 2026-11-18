// js/imagesConfig.js
(function () {
  const NCF_PHOTOS = {};

  function drawIllustratedScene(type, config = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 960, 680);
    if (type === 'scholastic') {
      bgGrad.addColorStop(0, '#2C1654');
      bgGrad.addColorStop(1, '#5A2B9C');
    } else if (type === 'sanitation') {
      bgGrad.addColorStop(0, '#3D2618');
      bgGrad.addColorStop(1, '#7A4A28');
    } else if (type === 'elderly') {
      bgGrad.addColorStop(0, '#2E1A14');
      bgGrad.addColorStop(1, '#6B3423');
    } else if (type === 'bakery' || type === 'beadwork') {
      bgGrad.addColorStop(0, '#3D1D5C');
      bgGrad.addColorStop(1, '#9E4D16');
    } else {
      bgGrad.addColorStop(0, '#5C3D2E');
      bgGrad.addColorStop(0.55, '#8A5E42');
      bgGrad.addColorStop(1, '#3B2318');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 960, 680);

    const sunGlow = ctx.createRadialGradient(480, 220, 30, 480, 260, 460);
    sunGlow.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
    sunGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, 960, 680);

    function drawPerson(cx, cy, scale, shirtColor, skinTone, isMentor = false, hasHijab = false, hasKufi = false) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      ctx.fillStyle = shirtColor;
      ctx.beginPath();
      ctx.roundRect(-52, 42, 104, 150, [26, 26, 8, 8]);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-18, 44);
      ctx.lineTo(0, 64);
      ctx.lineTo(18, 44);
      ctx.stroke();

      if (isMentor) {
        ctx.fillStyle = '#4B1D8F';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NCF Learners', 0, 96);
        ctx.fillStyle = '#D97724';
        ctx.fillText('League', 0, 112);
      }

      ctx.fillStyle = skinTone;
      ctx.fillRect(-13, 24, 26, 24);

      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.fill();

      if (hasHijab) {
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.arc(0, 2, 40, Math.PI * 0.85, Math.PI * 2.15);
        ctx.lineTo(42, 65);
        ctx.lineTo(-42, 65);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = skinTone;
        ctx.beginPath();
        ctx.arc(0, 2, 28, 0, Math.PI * 2);
        ctx.fill();
      } else if (hasKufi) {
        ctx.fillStyle = '#F3F4F6';
        ctx.beginPath();
        ctx.arc(0, -10, 34, Math.PI, 0);
        ctx.fill();
      } else {
        ctx.fillStyle = '#181210';
        ctx.beginPath();
        ctx.arc(0, -6, 34, Math.PI * 1.05, Math.PI * 1.95);
        ctx.fill();
      }

      ctx.fillStyle = '#181210';
      ctx.beginPath();
      ctx.arc(-11, -2, 3.2, 0, Math.PI * 2);
      ctx.arc(11, -2, 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#2A1810';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 8, 10, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      ctx.restore();
    }

    function drawScholasticBundle(cx, cy, scale = 1) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      for (let i = 4; i >= 0; i--) {
        ctx.fillStyle = i % 2 === 0 ? '#EDE9FE' : '#DDD6FE';
        ctx.strokeStyle = '#6D28D9';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-85, i * 8, 170, 26, 4);
        ctx.fill();
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
      ctx.fillRect(-95, -8, 190, 10);

      for (let p = 0; p < 4; p++) {
        ctx.fillStyle = p % 2 === 0 ? '#DC2626' : '#1F2937';
        ctx.fillRect(-65, -16 + p * 4, 130, 3.5);
      }

      ctx.fillStyle = '#2563EB';
      ctx.fillRect(-55, -22, 110, 4);
      ctx.restore();
    }

    if (type === 'group') {
      const positions = [
        { x: 170, y: 270, s: 0.92, c: '#DC2626', skin: '#5C3824' },
        { x: 280, y: 255, s: 0.96, c: '#F59E0B', skin: '#4A2C1B' },
        { x: 480, y: 215, s: 1.15, c: '#FFFFFF', skin: '#4A2C1B', mentor: true, kufi: true },
        { x: 675, y: 255, s: 0.96, c: '#6D28D9', skin: '#5C3824' },
        { x: 790, y: 270, s: 0.92, c: '#EA580C', skin: '#4A2C1B' },
        { x: 230, y: 375, s: 0.88, c: '#F8FAFC', skin: '#4A2C1B' },
        { x: 355, y: 370, s: 0.9, c: '#F472B6', skin: '#5C3824' },
        { x: 480, y: 380, s: 0.88, c: '#38BDF8', skin: '#4A2C1B' },
        { x: 605, y: 375, s: 0.9, c: '#DC2626', skin: '#5C3824' },
        { x: 725, y: 380, s: 0.88, c: '#7C3AED', skin: '#4A2C1B' },
      ];
      positions.forEach((p) => drawPerson(p.x, p.y, p.s, p.c, p.skin, p.mentor, false, p.kufi));
      drawScholasticBundle(340, 565, 0.85);
      drawScholasticBundle(620, 565, 0.85);
    } else if (type === 'mentor-chat' || type === 'mentor-group') {
      drawPerson(610, 225, 1.32, '#FFFFFF', '#4A2C1B', true, false, true);
      drawPerson(230, 345, 0.95, '#F97316', '#5C3824');
      drawPerson(345, 320, 1.0, '#DC2626', '#4A2C1B');
      drawPerson(445, 365, 0.92, '#38BDF8', '#5C3824');
      if (type === 'mentor-group') {
        drawPerson(765, 290, 1.02, '#1F2937', '#5C3824', false, true);
        drawPerson(290, 445, 0.9, '#F472B6', '#4A2C1B');
      }
    } else if (type === 'learner-portrait') {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(190, 35, 580, 610);
      ctx.fillStyle = '#4B1D8F';
      ctx.fillRect(215, 150, 530, 420);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OUR PROGRAMS • OUR MISSION', 480, 195);

      drawPerson(480, 265, 1.42, config.shirt || '#60A5FA', '#4A2C1B', false, Boolean(config.hijab), Boolean(config.kufi));
      drawScholasticBundle(480, 470, 1.25);
    } else if (type === 'scholastic') {
      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.roundRect(120, 290, 720, 330, 20);
      ctx.fill();

      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 12; row++) {
          ctx.fillStyle = row % 2 === 0 ? '#F3F4F6' : '#E5E7EB';
          ctx.fillRect(470 + col * 115, 350 + row * 19, 102, 15);
        }
      }
      for (let b = 0; b < 4; b++) {
        ctx.fillStyle = '#FACC15';
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(155 + b * 74, 330, 64, 210, 8);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(230, 145, 110, 155);
      ctx.fillRect(360, 145, 110, 155);
      ctx.fillStyle = '#1D4ED8';
      ctx.fillRect(245, 125, 80, 25);
      ctx.fillRect(375, 125, 80, 25);

      for (let c = 0; c < 8; c++) {
        ctx.fillStyle = c % 2 === 0 ? '#FDE047' : '#FACC15';
        ctx.fillRect(520, 155 + c * 22, 280, 18);
      }
    } else if (type === 'sanitation') {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(0, 420, 960, 260);
      drawPerson(320, 275, 1.15, '#FACC15', '#4A2C1B');
      drawPerson(520, 265, 1.2, '#4B1D8F', '#5C3824', false, false, true);
      drawPerson(700, 285, 1.1, '#D97724', '#4A2C1B');
    } else if (type === 'elderly') {
      drawPerson(360, 275, 1.25, '#B91C1C', '#4A2C1B');
      drawPerson(610, 255, 1.25, '#DC2626', '#5C3824');
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(435, 250);
      ctx.lineTo(435, 610);
      ctx.stroke();
    } else if (type === 'bakery' || type === 'beadwork') {
      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.roundRect(140, 390, 680, 220, 24);
      ctx.fill();
      drawPerson(320, 245, 1.15, '#4B1D8F', '#4A2C1B');
      drawPerson(640, 245, 1.15, '#D97724', '#5C3824');
      const colors = ['#F59E0B', '#EC4899', '#10B981', '#3B82F6', '#8B5CF6'];
      for (let i = 0; i < 24; i++) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(260 + (i % 8) * 60, 445 + Math.floor(i / 8) * 38, 13, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.roundRect(710, 622, 226, 36, 10);
    ctx.fill();
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('NCF • Compassion In Action', 922, 645);

    return canvas.toDataURL('image/jpeg', 0.9);
  }

  const photoConfigs = {
    'more-learners.jpeg': { type: 'group' },
    'chating-with-learners.jpeg': { type: 'mentor-chat' },
    'Mentor-with-learners.jpeg': { type: 'mentor-group' },
    'scholastic.jpeg': { type: 'scholastic' },
    'learner1.jpeg': { type: 'learner-portrait', shirt: '#6366F1', kufi: true },
    'learner2.jpeg': { type: 'learner-portrait', shirt: '#F472B6' },
    'learner3.jpeg': { type: 'learner-portrait', shirt: '#38BDF8' },
    'learner4.jpeg': { type: 'learner-portrait', shirt: '#60A5FA' },
    'learner5.jpeg': { type: 'learner-portrait', shirt: '#93C5FD', hijab: true },
    'learner6.jpeg': { type: 'learner-portrait', shirt: '#FDE68A' },
    'tweyonje-sanitation.jpeg': { type: 'sanitation' },
    'elderly-care.jpeg': { type: 'elderly' },
    'bakery-skilling.jpeg': { type: 'bakery' },
    'beadwork-skilling.jpeg': { type: 'beadwork' },
  };

  Object.keys(photoConfigs).forEach((key) => {
    NCF_PHOTOS[key] = drawIllustratedScene(photoConfigs[key].type, photoConfigs[key]);
  });

  Object.keys(photoConfigs).forEach((key) => {
    const probe = new Image();
    probe.onload = function () {
      NCF_PHOTOS[key] = `images/${key}`;
      if (typeof window.refreshAllManagedImages === 'function') {
        window.refreshAllManagedImages();
      }
    };
    probe.src = `images/${key}`;
  });

  window.NCF_PHOTOS = NCF_PHOTOS;
})();