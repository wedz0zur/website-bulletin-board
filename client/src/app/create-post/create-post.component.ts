import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  constructor(private router: Router) {}

  categories = [
    {
      name: 'Транспорт',
      subcategories: [
        { name: 'Автомобили', subsubcategories: ['Легковые', 'Электромобили', 'Ретро автомобили'] },
        { name: 'Грузовики и спецтехника', subsubcategories: ['Грузовики', 'Погрузчики', 'Экскаваторы'] },
        { name: 'Мотоциклы и мототехника', subsubcategories: ['Мотоциклы', 'Скутеры', 'Квадроциклы'] },
        { name: 'Водный транспорт', subsubcategories: ['Катера', 'Яхты', 'Лодки'] },
      ]
    },
    {
      name: 'Одежда, обувь, аксессуары',
      subcategories: [
        { name: 'Женская одежда', subsubcategories: ['Платья', 'Блузки', 'Юбки'] },
        { name: 'Мужская одежда', subsubcategories: ['Рубашки', 'Куртки', 'Брюки'] },
        { name: 'Обувь', subsubcategories: ['Кроссовки', 'Ботинки', 'Туфли'] },
        { name: 'Аксессуары', subsubcategories: ['Сумки', 'Очки', 'Часы'] }
      ]
    },
    {
      name: 'Животные',
      subcategories: [
        { name: 'Собаки', subsubcategories: ['Щенки', 'Породистые', 'Без породы'] },
        { name: 'Кошки', subsubcategories: ['Котята', 'Породистые', 'Без породы'] },
        { name: 'Птицы', subsubcategories: ['Попугаи', 'Канарейки'] },
      ]
    },
    {
      name: 'Запчасти',
      subcategories: [
        { name: 'Для легковых', subsubcategories: ['Двигатель', 'Тормоза', 'Фары'] },
        { name: 'Для грузовиков', subsubcategories: ['Шины', 'Кузов', 'Кабина'] },
        { name: 'Мотозапчасти', subsubcategories: ['Цепи', 'Ручки', 'Пластик'] }
      ]
    },
    {
      name: 'Электроника',
      subcategories: [
        { name: 'Телефоны', subsubcategories: ['Смартфоны', 'Кнопочные', 'Аксессуары'] },
        { name: 'Компьютеры', subsubcategories: ['Ноутбуки', 'Системные блоки', 'Мониторы'] },
        { name: 'Бытовая техника', subsubcategories: ['Холодильники', 'Пылесосы', 'Микроволновки'] }
      ]
    },
    {
      name: 'Услуги',
      subcategories: [
        { name: 'Ремонт', subsubcategories: ['Квартир', 'Техники', 'Авто'] },
        { name: 'Обучение', subsubcategories: ['Иностранные языки', 'Музыка', 'Подготовка к ЕГЭ'] },
        { name: 'Красота', subsubcategories: ['Парикмахерские', 'Маникюр', 'Косметология'] }
      ]
    },
    {
      name: 'Красота и здоровье',
      subcategories: [
        { name: 'Косметика', subsubcategories: ['Уход за кожей', 'Макияж', 'Парфюмерия'] },
        { name: 'Медтехника', subsubcategories: ['Тонометры', 'Глюкометры', 'Массажёры'] },
        { name: 'Фитнес и спорт', subsubcategories: ['Тренажёры', 'Спортивное питание', 'Одежда'] }
      ]
    }
  ];

  selectedCategory: string | null = null;
  selectedSubcategory: string | null = null;
  showSubcategories = false;
  showSubsubcategories = false;

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.selectedSubcategory = null;
    this.showSubcategories = true;
    this.showSubsubcategories = false;
    console.log('Выбрана категория:', category);
  }

  selectSubcategory(subcategory: string) {
    this.selectedSubcategory = subcategory;
    this.showSubsubcategories = true;
    console.log('Выбрана подкатегория:', subcategory);
  }

  getCurrentSubcategories() {
    const category = this.categories.find(c => c.name === this.selectedCategory);
    return category ? category.subcategories : [];
  }

  getCurrentSubsubcategories() {
    const subcategories = this.getCurrentSubcategories();
    const subcategory = subcategories.find(sc => sc.name === this.selectedSubcategory);
    return subcategory ? subcategory.subsubcategories : [];
  }

  goToSubsubcategory(subsubcategory: string) {
    console.log('Переход на подподкатегорию:', {
      category: this.selectedCategory,
      subcategory: this.selectedSubcategory,
      subsubcategory: subsubcategory
    });
    this.router.navigate(['/subsubcategory-detail'], {
      queryParams: {
        category: this.selectedCategory,
        subcategory: this.selectedSubcategory,
        subsubcategory: subsubcategory
      }
    });
  }
}