(function () {
  'use strict';

  window.FLOWER_DATA = {
    sunflower: {
      id: 'sunflower',
      colors: { petal: '#F0C848', petalHi: '#F8E090', center: '#6B4A28', stem: '#5A7848', leaf: '#6B8860' },
      isTarget: true,
    },
    chenguang: {
      id: 'chenguang',
      name: '晨光',
      intro: '向日葵总会朝着太阳生长。\n即使太阳还没有出现。\n它也会静静等待。',
      meaning: '愿你每天醒来。\n都能遇见一点点光。',
    },
    weifeng: {
      id: 'weifeng',
      name: '微风',
      intro: '微风经过的时候，向日葵总会轻轻点头，像是在和路过的人打招呼。',
      meaning: '愿温柔的风，也会轻轻经过你的生活。',
    },
    nuanyang: {
      id: 'nuanyang',
      name: '暖阳',
      intro: '有人说，向日葵收藏着夏天最温暖的颜色。所以，看见它的时候，心情总会变好一点。',
      meaning: '愿你的每一天，都像今天一样，有阳光，也有好心情。',
    },
    heguang: {
      id: 'heguang',
      name: '河光',
      intro: '它每天看着泰晤士河流过，看着船离开，也看着新的旅人到来。它相信，每一次相遇，都有自己的意义。',
      meaning: '愿你走过很多地方，\n依然能遇见属于自己的光。',
    },
    muse: {
      id: 'muse',
      name: '暮色',
      intro: '太阳落下以后，很多花都会闭上眼睛。但向日葵记得。白天给予它的温暖。所以，它依然相信明天会到来。',
      meaning: '愿你在黑暗的时候，\n也记得曾经拥有过的光。',
    },
    yuanhang: {
      id: 'yuanhang',
      name: '远航',
      intro: '河水一直向前。带着船，带着故事，也带着许多未知的地方。向日葵相信，离开熟悉的位置，也能找到新的阳光。',
      meaning: '愿你勇敢走向远方，\n每一步，\n都有新的风景。',
    },
    xinghui: {
      id: 'xinghui',
      name: '星辉',
      intro: '夜晚，并不只有黑暗。\n总会有一颗星，\n默默照亮前方的路。\n即使太阳还没有升起，\n它也会陪伴每一位赶路的人。',
      meaning: '愿你在人生漫长的夜晚，\n也能找到属于自己的方向。',
    },
    xinyuan: {
      id: 'xinyuan',
      name: '心愿',
      intro: '有人会向流星许愿，\n有人会静静目送它远去。\n\n其实，\n每一个认真珍惜的愿望，\n都会在未来的某一天，\n悄悄发芽。',
      meaning: '愿你的每一个心愿，\n都能慢慢长成想要的模样。',
    },
    weiguang: {
      id: 'weiguang',
      name: '微光',
      intro: '不是所有的光，\n都来自太阳。\n\n有时候。\n\n一只小小的萤火虫。\n\n也能照亮一段夜路。',
      meaning: '愿你成为别人的微光，\n也愿你在人生的旅途中，\n遇见属于自己的温暖。',
    },
    dishiduo: {
      id: 'dishiduo',
      name: '第十朵向日葵',
      meaningLabel: '花语',
      meaningFirst: true,
      meaning: '纯真、温暖、被赠予的善意。',
      intro: '它藏在公园柔软的草地旁。\n阳光落下来的时候，\n小小的花瓣轻轻晃动。\n像某个陌生人的一份礼物。\n没有理由。\n也没有期待回报。\n只是因为看见了你，\n所以想把这份美好交给你。',
    },
    dishiyi: {
      id: 'dishiyi',
      name: '第十一朵向日葵',
      meaningLabel: '花语',
      meaningFirst: true,
      meaning: '相遇、心动、故事的开始。',
      intro: '它开在一条普通的街道旁。\n没有特别的风景，\n也没有特别的日子。\n可那一天，\n因为遇见了某个人，\n平凡的下午，\n变成了值得记住的瞬间。\n有些相遇，\n从一开始就悄悄改变了未来。',
    },
    dishier: {
      id: 'dishier',
      name: '第十二朵向日葵',
      meaningLabel: '花语',
      meaningFirst: true,
      meaning: '重逢、守护、圆满的答案。',
      intro: '它出现在旅程最后的地方。\n像是一直等待着谁的到来。\n走过那么多风景，\n寻找那么久。\n才终于发现，\n最后一朵花，\n早已被一个重要的人好好珍藏。\n它不是终点。\n而是告诉你：\n那些珍惜过的、爱过的、陪伴过的，\n从未真正离开。',
    },
    daisy: {
      id: 'daisy',
      name: '雏菊',
      meaning: '天真、快乐、希望。',
      description: '小小的花朵，总是安安静静地盛开在草地上。虽然不起眼，却总会让人忍不住停下来看看。',
      voice: ['好可爱。', '不过……', '我要找的。', '不是这一朵。'],
    },
    lily: {
      id: 'lily',
      name: '铃兰',
      meaning: '幸福归来。',
      description: '铃兰喜欢躲在树荫下面。风吹过的时候，小小的花铃会轻轻摇晃。',
      voice: ['原来。', '藏在这里呀。', '可惜。', '不是向日葵。'],
    },
    lavender: {
      id: 'lavender',
      name: '薰衣草',
      meaning: '等待。',
      description: '淡淡的香气，就像森林里的风一样。轻轻地，慢慢地。',
      voice: ['好香。', '差一点。', '就以为找到啦。'],
    },
    dandelion: {
      id: 'dandelion',
      name: '蒲公英',
      meaning: '自由。',
      description: '风一吹，它就会带着种子，飞向新的地方。',
      voice: ['如果跟着风。', '会不会更快找到呢？'],
    },
    bellflower: {
      id: 'bellflower',
      name: '风铃草',
      meaning: '感谢。',
      description: '森林深处，偶尔能听见风吹过花丛的声音。',
      voice: ['真漂亮。', '先记住你吧。'],
    },
    poppy: {
      id: 'poppy',
      name: '虞美人',
      meaning: '安慰、思念、温柔的回忆。',
      description: '河岸边偶尔会看见它。\n\n纤细的花茎。\n\n却能迎着风轻轻摇摆。\n\n像是在和经过的人打招呼。',
      voice: [
        '好像认识了。',
        '一个住在河边的小朋友。',
        '可是。',
        '我要找的。',
        '还是那朵向日葵。',
      ],
    },
    cornflower: {
      id: 'cornflower',
      name: '矢车菊',
      meaning: '幸福、宁静。',
      description: '蓝色的小花。\n\n喜欢出现在草地和道路旁。\n\n它不像玫瑰那么耀眼。\n\n却总能让经过的人停下来。',
      voice: [
        '伦敦的风。',
        '好像把很多小花。',
        '都带到了这里。',
      ],
    },
    violet: {
      id: 'violet',
      name: '紫罗兰',
      meaning: '谦逊、隐藏的爱。',
      description: '紫罗兰喜欢躲在不起眼的地方。\n\n墙角。\n\n石缝。\n\n树旁。\n\n只要有一点阳光。\n\n它就会慢慢开放。',
      voice: [
        '原来。',
        '有些花。',
        '不一定要站在最显眼的地方。',
        '也可以被发现。',
      ],
    },
    foxglove: {
      id: 'foxglove',
      name: '狐手套花',
      meaning: '真诚、守护。',
      description: '高高的花穗。\n\n像一串串小铃铛。\n\n静静站在风里。\n\n陪伴着每一位经过的人。',
      voice: ['长得好高。', '差点就以为。', '找到向日葵了。'],
    },
    yarrow: {
      id: 'yarrow',
      name: '西洋蓍草',
      meaning: '勇气、治愈。',
      description: '一朵朵细小的花。\n\n聚在一起。\n\n就像夜空里的星星。\n\n虽然不起眼。\n\n却总能让人多看一眼。',
      voice: ['原来。', '小小的花。', '也可以这么漂亮。'],
    },
    wildrose: {
      id: 'wildrose',
      name: '野玫瑰',
      meaning: '纯真、美好的相遇。',
      description: '淡淡的花香。\n\n随着风轻轻飘散。\n\n它没有花园里的玫瑰那么华丽。\n\n却有属于自己的自由。',
      voice: ['真好看。', '不过。', '我还要继续寻找。'],
    },
    buttercup: {
      id: 'buttercup',
      name: '金凤花',
      meaning: '快乐、童心。',
      description: '阳光落下的时候。\n\n花瓣会闪着淡淡的金色。\n\n像把一小块阳光。\n\n留在了草地上。',
      voice: ['差一点。', '就把你认成向日葵了。'],
    },
  };

  window.SUNFLOWER_TOTAL = 12;

  window.MILESTONE_MONOLOGUES = {};
})();
