import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostService } from '../service/post.service';
import { LoginService } from '../service/login.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-subsubcategory-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subsubcategory-detail.component.html',
  styleUrls: ['./subsubcategory-detail.component.css']
})
export class SubsubcategoryDetailComponent implements OnInit {
    user: any = null;
  category: string = '';
  subcategory: string = '';
  subsubcategory: string = '';
  errorMessage: string = '';
  inputFields: any[] = [];
  postData: any = {
    title: '',
    description: '',
    price: null,
    currency: 'RUB',
    location: '',
    contact_name: '',
    contact_methods: ['phone', 'whatsapp'],
    phone: '',
    photos: [],
    additional_fields: {}
  };

  inputConfig: Record<string, any[]> = {
    'Легковые': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'year', label: 'Год выпуска', type: 'number', required: true, min: 1900, max: 2025 },
      { name: 'mileage', label: 'Пробег (км)', type: 'number', required: true, min: 0 },
    ],
    'Электромобили': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'battery', label: 'Ёмкость батареи (кВт⋅ч)', type: 'number', required: true, min: 0 },
      { name: 'range', label: 'Запас хода (км)', type: 'number', required: true, min: 0 },
    ],
    'Ретро автомобили': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'year', label: 'Год выпуска', type: 'number', required: true, min: 1900, max: 2000 },
      { name: 'condition', label: 'Состояние', type: 'text', required: true, minlength: 1 },
    ],
    'Грузовики': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'load', label: 'Грузоподъёмность (т)', type: 'number', required: true, min: 0 },
      { name: 'axles', label: 'Количество осей', type: 'number', required: true, min: 2 },
    ],
    'Погрузчики': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'load_capacity', label: 'Грузоподъёмность (кг)', type: 'number', required: true, min: 0 },
    ],
    'Экскаваторы': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'bucket_volume', label: 'Объём ковша (м³)', type: 'number', required: true, min: 0 },
    ],
    'Мотоциклы': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'engine_volume', label: 'Объём двигателя (см³)', type: 'number', required: true, min: 50 },
    ],
    'Скутеры': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'power', label: 'Мощность (л.с.)', type: 'number', required: true, min: 0 },
    ],
    'Квадроциклы': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'engine_type', label: 'Тип двигателя', type: 'text', required: true, minlength: 1 },
    ],
    'Катера': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'length', label: 'Длина (м)', type: 'number', required: true, min: 0 },
    ],
    'Яхты': [
      { name: 'brand', label: 'Марка', type: 'text', required: true, minlength: 1 },
      { name: 'cabins', label: 'Количество кают', type: 'number', required: true, min: 1 },
    ],
    'Лодки': [
      { name: 'type', label: 'Тип лодки', type: 'text', required: true, minlength: 1 },
      { name: 'capacity', label: 'Вместимость (чел.)', type: 'number', required: true, min: 1 },
    ],
    'Платья': [
      { name: 'size', label: 'Размер', type: 'text', required: true, minlength: 1 },
      { name: 'material', label: 'Материал', type: 'text', required: true, minlength: 1 },
    ],
    'Блузки': [
      { name: 'size', label: 'Размер', type: 'text', required: true, minlength: 1 },
      { name: 'color', label: 'Цвет', type: 'text', required: true, minlength: 1 },
    ],
    'Юбки': [
      { name: 'size', label: 'Размер', type: 'text', required: true, minlength: 1 },
      { name: 'length', label: 'Длина', type: 'text', required: true, minlength: 1 },
    ],
    'Рубашки': [
      { name: 'size', label: 'Размер', type: 'text', required: true, minlength: 1 },
      { name: 'material', label: 'Материал', type: 'text', required: true, minlength: 1 },
    ],
    'Куртки': [
      { name: 'size', label: 'Размер', type: 'text', required: true, minlength: 1 },
      { name: 'season', label: 'Сезон', type: 'text', required: true, minlength: 1 },
    ],
    'Брюки': [
      { name: 'size', label: 'Размер', type: 'text', required: true, minlength: 1 },
      { name: 'style', label: 'Стиль', type: 'text', required: true, minlength: 1 },
    ],
    'Кроссовки': [
      { name: 'size', label: 'Размер', type: 'text', required: true, minlength: 1 },
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
    ],
    'Ботинки': [
      { name: 'size', label: 'Размер', type: 'text', required: true, minlength: 1 },
      { name: 'material', label: 'Материал', type: 'text', required: true, minlength: 1 },
    ],
    'Туфли': [
      { name: 'size', label: 'Размер', type: 'text', required: true, minlength: 1 },
      { name: 'heel_height', label: 'Высота каблука (см)', type: 'number', required: true, min: 0 },
    ],
    'Сумки': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'type', label: 'Тип сумки', type: 'text', required: true, minlength: 1 },
    ],
    'Очки': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'type', label: 'Тип очков', type: 'text', required: true, minlength: 1 },
    ],
    'Часы': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'mechanism', label: 'Механизм', type: 'text', required: true, minlength: 1 },
    ],
    'Щенки': [
      { name: 'breed', label: 'Порода', type: 'text', required: true, minlength: 1 },
      { name: 'age', label: 'Возраст (мес.)', type: 'number', required: true, min: 0 },
    ],
    'Породистые': [
      { name: 'breed', label: 'Порода', type: 'text', required: true, minlength: 1 },
      { name: 'pedigree', label: 'Наличие родословной', type: 'text', required: true, minlength: 1 },
    ],
    'Без породы': [
      { name: 'age', label: 'Возраст (мес.)', type: 'number', required: true, min: 0 },
      { name: 'color', label: 'Окрас', type: 'text', required: true, minlength: 1 },
    ],
    'Котята': [
      { name: 'breed', label: 'Порода', type: 'text', required: true, minlength: 1 },
      { name: 'age', label: 'Возраст (мес.)', type: 'number', required: true, min: 0 },
    ],
    'Попугаи': [
      { name: 'species', label: 'Вид', type: 'text', required: true, minlength: 1 },
      { name: 'age', label: 'Возраст', type: 'text', required: true, minlength: 1 },
    ],
    'Канарейки': [
      { name: 'color', label: 'Окрас', type: 'text', required: true, minlength: 1 },
      { name: 'age', label: 'Возраст', type: 'text', required: true, minlength: 1 },
    ],
    'Двигатель': [
      { name: 'type', label: 'Тип двигателя', type: 'text', required: true, minlength: 1 },
      { name: 'volume', label: 'Объём (л)', type: 'number', required: true, min: 0 },
    ],
    'Тормоза': [
      { name: 'type', label: 'Тип тормозов', type: 'text', required: true, minlength: 1 },
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
    ],
    'Фары': [
      { name: 'type', label: 'Тип фар', type: 'text', required: true, minlength: 1 },
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
    ],
    'Шины': [
      { name: 'size', label: 'Размер шин', type: 'text', required: true, minlength: 1 },
      { name: 'season', label: 'Сезонность', type: 'text', required: true, minlength: 1 },
    ],
    'Кузов': [
      { name: 'part', label: 'Часть кузова', type: 'text', required: true, minlength: 1 },
      { name: 'material', label: 'Материал', type: 'text', required: true, minlength: 1 },
    ],
    'Кабина': [
      { name: 'type', label: 'Тип кабины', type: 'text', required: true, minlength: 1 },
      { name: 'condition', label: 'Состояние', type: 'text', required: true, minlength: 1 },
    ],
    'Цепи': [
      { name: 'type', label: 'Тип цепи', type: 'text', required: true, minlength: 1 },
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
    ],
    'Ручки': [
      { name: 'type', label: 'Тип ручек', type: 'text', required: true, minlength: 1 },
      { name: 'material', label: 'Материал', type: 'text', required: true, minlength: 1 },
    ],
    'Пластик': [
      { name: 'part', label: 'Часть пластика', type: 'text', required: true, minlength: 1 },
      { name: 'color', label: 'Цвет', type: 'text', required: true, minlength: 1 },
    ],
    'Смартфоны': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'memory', label: 'Объём памяти (ГБ)', type: 'number', required: true, min: 0 },
    ],
    'Кнопочные': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'condition', label: 'Состояние', type: 'text', required: true, minlength: 1 },
    ],
    'Аксессуары': [
      { name: 'type', label: 'Тип аксессуара', type: 'text', required: true, minlength: 1 },
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
    ],
    'Ноутбуки': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'ram', label: 'Оперативная память (ГБ)', type: 'number', required: true, min: 0 },
    ],
    'Системные блоки': [
      { name: 'cpu', label: 'Процессор', type: 'text', required: true, minlength: 1 },
      { name: 'gpu', label: 'Видеокарта', type: 'text', required: true, minlength: 1 },
    ],
    'Мониторы': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'size', label: 'Диагональ (дюймы)', type: 'number', required: true, min: 0 },
    ],
    'Холодильники': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'volume', label: 'Объём (л)', type: 'number', required: true, min: 0 },
    ],
    'Пылесосы': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'power', label: 'Мощность (Вт)', type: 'number', required: true, min: 0 },
    ],
    'Микроволновки': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'volume', label: 'Объём (л)', type: 'number', required: true, min: 0 },
    ],
    'Квартир': [
      { name: 'type', label: 'Тип ремонта', type: 'text', required: true, minlength: 1 },
      { name: 'area', label: 'Площадь (м²)', type: 'number', required: true, min: 0 },
    ],
    'Техники': [
      { name: 'device', label: 'Тип техники', type: 'text', required: true, minlength: 1 },
      { name: 'issue', label: 'Неисправность', type: 'text', required: true, minlength: 1 },
    ],
    'Авто': [
      { name: 'car_brand', label: 'Марка авто', type: 'text', required: true, minlength: 1 },
      { name: 'service', label: 'Тип услуги', type: 'text', required: true, minlength: 1 },
    ],
    'Иностранные языки': [
      { name: 'language', label: 'Язык', type: 'text', required: true, minlength: 1 },
      { name: 'level', label: 'Уровень', type: 'text', required: true, minlength: 1 },
    ],
    'Музыка': [
      { name: 'instrument', label: 'Инструмент', type: 'text', required: true, minlength: 1 },
      { name: 'level', label: 'Уровень', type: 'text', required: true, minlength: 1 },
    ],
    'Подготовка к ЕГЭ': [
      { name: 'subject', label: 'Предмет', type: 'text', required: true, minlength: 1 },
      { name: 'format', label: 'Формат занятий', type: 'text', required: true, minlength: 1 },
    ],
    'Парикмахерские': [
      { name: 'service', label: 'Тип услуги', type: 'text', required: true, minlength: 1 },
      { name: 'duration', label: 'Длительность (ч)', type: 'number', required: true, min: 0 },
    ],
    'Маникюр': [
      { name: 'type', label: 'Тип маникюра', type: 'text', required: true, minlength: 1 },
      { name: 'design', label: 'Дизайн', type: 'text', required: true, minlength: 1 },
    ],
    'Косметология': [
      { name: 'procedure', label: 'Процедура', type: 'text', required: true, minlength: 1 },
      { name: 'duration', label: 'Длительность (ч)', type: 'number', required: true, min: 0 },
    ],
    'Уход за кожей': [
      { name: 'type', label: 'Тип средства', type: 'text', required: true, minlength: 1 },
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
    ],
    'Макияж': [
      { name: 'type', label: 'Тип макияжа', type: 'text', required: true, minlength: 1 },
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
    ],
    'Парфюмерия': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'volume', label: 'Объём (мл)', type: 'number', required: true, min: 0 },
    ],
    'Тонометры': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'type', label: 'Тип тонометра', type: 'text', required: true, minlength: 1 },
    ],
    'Глюкометры': [
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
      { name: 'strips', label: 'Совместимость с полосками', type: 'text', required: true, minlength: 1 },
    ],
    'Массажёры': [
      { name: 'type', label: 'Тип массажёра', type: 'text', required: true, minlength: 1 },
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
    ],
    'Тренажёры': [
      { name: 'type', label: 'Тип тренажёра', type: 'text', required: true, minlength: 1 },
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
    ],
    'Спортивное питание': [
      { name: 'type', label: 'Тип питания', type: 'text', required: true, minlength: 1 },
      { name: 'brand', label: 'Бренд', type: 'text', required: true, minlength: 1 },
    ],
    'Одежда': [
      { name: 'type', label: 'Тип одежды', type: 'text', required: true, minlength: 1 },
      { name: 'size', label: 'Размер', type: 'text', required: true, minlength: 1 },
    ]
  };


  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private loginService: LoginService,
    private router: Router
  ) {}

async ngOnInit() {
   this.loginService.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        console.log(this.user);
      },
      error: (error: any) => {
        console.error('Error fetching profile:', error);
      },
    });
  this.category = this.route.snapshot.queryParams['category'] || '';
  this.subcategory = this.route.snapshot.queryParams['subcategory'] || '';
  this.subsubcategory = this.route.snapshot.queryParams['subsubcategory'] || '';
  try {
    localStorage.setItem('userId', this.user._id);
  } catch (error) {
    console.error('Ошибка получения профиля:', error);;
  }
  if (this.inputConfig[this.subsubcategory]) {
    this.inputFields = this.inputConfig[this.subsubcategory];
  }
}

  private getUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload._id || payload.sub || null;
    } catch (e) {
      console.error('Ошибка декодирования токена:', e);
      return null;
    }
  }

  loadInputFields() {
    this.inputFields = this.inputConfig[this.subsubcategory] || [];
    if (this.inputFields.length === 0 && this.subsubcategory) {
      this.errorMessage = `Поля для подподкатегории "${this.subsubcategory}" не настроены.`;
    }
    this.inputFields.forEach(field => {
      if (!this.postData.additional_fields[field.name]) {
        this.postData.additional_fields[field.name] = '';
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 2 * 1024 * 1024;
      const maxFiles = 12;

      if (input.files.length > maxFiles) {
        this.errorMessage = `Максимум ${maxFiles} изображений`;
        return;
      }

      this.postData.photos = [];
      Array.from(input.files).forEach(file => {
        if (!allowedTypes.includes(file.type)) {
          this.errorMessage = 'Допустимы только изображения JPEG, JPG или PNG';
          return;
        }
        if (file.size > maxSize) {
          this.errorMessage = 'Размер файла не должен превышать 2МБ';
          return;
        }
        this.postData.photos.push(file);
      });

      this.errorMessage = '';
      const uploadText = input.nextElementSibling?.nextElementSibling as HTMLElement;
      if (uploadText) {
        uploadText.textContent = `${this.postData.photos.length} файл(ов) выбрано`;
      }
    }
  }

  onContactMethodChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const method = input.name.replace('contact_', '');
    if (input.checked) {
      if (!this.postData.contact_methods.includes(method)) {
        this.postData.contact_methods.push(method);
      }
    } else {
      this.postData.contact_methods = this.postData.contact_methods.filter((m: string) => m !== method);
    }
  }

async onSubmit(form: NgForm) {
  if (form.invalid) {
    this.errorMessage = 'Пожалуйста, заполните все обязательные поля корректно';
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    this.errorMessage = 'Вы должны быть авторизованы';
    this.router.navigate(['/login']);
    return;
  }

  if (!this.postData.title || this.postData.title.length < 5) {
    this.errorMessage = 'Заголовок должен содержать минимум 5 символов';
    return;
  }
  if (!this.postData.description || this.postData.description.length < 20) {
    this.errorMessage = 'Описание должно содержать минимум 20 символов';
    return;
  }
  if (this.postData.price === null || this.postData.price <= 0) {
    this.errorMessage = 'Укажите корректную цену (больше 0)';
    return;
  }
  if (!this.postData.location) {
    this.errorMessage = 'Укажите местоположение';
    return;
  }
  if (!this.postData.contact_name) {
    this.errorMessage = 'Укажите имя для связи';
    return;
  }
  if (!this.postData.phone || !/\+7\s?[0-9]{3}\s?[0-9]{3}-?[0-9]{2}-?[0-9]{2}/.test(this.postData.phone)) {
    this.errorMessage = 'Укажите корректный номер телефона (например, +7 999 123-45-67)';
    return;
  }

  const formData = new FormData();
  formData.append('title', this.postData.title);
  formData.append('description', this.postData.description);
  formData.append('price', this.postData.price.toString());
  formData.append('currency', this.postData.currency);
  formData.append('location', this.postData.location);
  formData.append('contact_name', this.postData.contact_name);
  formData.append('phone', this.postData.phone);
  formData.append('category', this.category);
  formData.append('subcategory', this.subcategory || '');
  formData.append('subsubcategory', this.subsubcategory || '');
  formData.append('contact_methods', JSON.stringify(this.postData.contact_methods));
  formData.append('additional_fields', JSON.stringify(this.postData.additional_fields));
  formData.append('author', this.user._id);
  this.postData.photos.forEach((file: File, index: number) => {
    formData.append('image', file, file.name);
  });

  for (let [key, value] of formData.entries()) {
    console.log(`FormData: ${key} = ${value instanceof File ? value.name : value}`);
  }

  this.postService.addPost(formData, token).subscribe({
    next: (response: any) => {
      console.log('Пост успешно создан:', response);
      this.router.navigate(['/home']);
    },
    error: (e: HttpErrorResponse) => {
      if (e.status === 400 && e.error.message.includes('E11000 duplicate key error')) {
        this.errorMessage = 'Объявление с таким заголовком уже существует';
      } else {
        this.errorMessage = e.error?.message || 'Ошибка при создании поста';
      }
      console.error('Ошибка:', e);
    }
  });
}

  onSaveDraft() {
    console.log('Сохранение черновика:', this.postData);
    this.errorMessage = 'Черновик сохранён (функционал в разработке)';
  }
}
