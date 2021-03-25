import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import FoodCard from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { Food } from '../../models/food.model';

import { FoodsContainer } from './styles';

export default function Dashboard() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [editingFood, setEditingFood] = useState<Food>({} as Food);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFoods() {
      const { data } = await api.get('/foods');
      setFoods(data);
    }

    getFoods();
  }, []);

  async function handleAddFood(food: Food) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Food) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(food =>
        food.id !== foodUpdated.data.id ? food : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  function toggleEditModal() {
    setIsEditModalOpen(!isEditModalOpen);
  }

  function handleEditFood(food: Food) {
    setEditingFood(food);
    setIsEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <FoodCard
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
