const TICKETS_KEY = 'zoo_ticket_orders';
const BANNERS_KEY = 'zoo_banners';

const initialBanners = [
  {
    id: 1,
    image: '/hero.png',
    subtitle: 'Nâng Cao Trải Nghiệm Du Khách',
    title: 'Hành Trình Khám Phá Muôn Loài Tại Sở Thú',
    description: '',
    buttonText: 'Mua Vé Ngay',
    link: '/tickets',
    showDesc: true,
    status: 'Đang hiển thị'
  },
  {
    id: 2,
    image: '/panda.png',
    subtitle: 'Mới Mở Cửa',
    title: 'Gấu Trúc Khổng Lồ',
    description: '',
    buttonText: 'TÌM HIỂU THÊM ▸',
    link: '/tickets',
    showDesc: false,
    status: 'Đang hiển thị'
  }
];

const readList = (key, defaultList = []) => {
  try {
    const value = localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : [];
    
    if (parsed.length === 0 && defaultList.length > 0) {
      localStorage.setItem(key, JSON.stringify(defaultList));
      return defaultList;
    }
    
    return parsed;
  } catch {
    return defaultList;
  }
};

const writeList = (key, list) => {
  localStorage.setItem(key, JSON.stringify(list));
};

export const getTicketOrders = () => readList(TICKETS_KEY);

export const saveTicketOrder = (order) => {
  const orders = getTicketOrders();
  const nextOrders = [order, ...orders];
  writeList(TICKETS_KEY, nextOrders);
  return nextOrders;
};

export const getBanners = () => {
  const banners = readList(BANNERS_KEY, initialBanners);
  let modified = false;
  const migrated = banners.map(b => {
    let changed = false;
    if (b.id === 1) {
      if (b.subtitle === 'Khám Phá Thiên Nhiên' || b.subtitle === '') {
        if (b.description && !b.description.includes('Trải nghiệm vẻ đẹp kỳ diệu') && b.description !== '') {
          b.subtitle = b.description;
        } else {
          b.subtitle = 'Nâng Cao Trải Nghiệm Du Khách';
        }
        b.description = '';
        changed = true;
      } else if (b.description === 'Nâng Cao Trải Nghiệm Du Khách') {
        b.subtitle = 'Nâng Cao Trải Nghiệm Du Khách';
        b.description = '';
        changed = true;
      }
    }
    const keysToDelete = ['textAlign', 'titleSize', 'titleColor', 'subtitleText', 'subtitleSize', 'subtitleColor'];
    keysToDelete.forEach(k => {
      if (k in b) {
        delete b[k];
        changed = true;
      }
    });
    if (changed) modified = true;
    return b;
  });
  if (modified) {
    saveBanners(migrated);
  }
  return migrated;
};

export const saveBanners = (banners) => {
  writeList(BANNERS_KEY, banners);
};
