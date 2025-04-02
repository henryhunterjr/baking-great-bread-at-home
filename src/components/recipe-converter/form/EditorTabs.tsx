
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecipeData } from '@/types/recipeTypes';
import BasicInfoTab from './tabs/BasicInfoTab';
import IngredientsTab from './tabs/IngredientsTab';
import InstructionsTab from './tabs/InstructionsTab';
import NotesTab from './tabs/NotesTab';
import EquipmentTab from './tabs/EquipmentTab';

interface EditorTabsProps {
  initialRecipe: RecipeData;
}

const EditorTabs: React.FC<EditorTabsProps> = ({ initialRecipe }) => {
  return (
    <Tabs defaultValue="basic-info" className="w-full">
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
        <TabsTrigger value="instructions">Instructions</TabsTrigger>
        <TabsTrigger value="notes">Notes & Tips</TabsTrigger>
        <TabsTrigger value="equipment">Equipment</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic-info">
        <BasicInfoTab />
      </TabsContent>
      
      <TabsContent value="ingredients">
        <IngredientsTab />
      </TabsContent>
      
      <TabsContent value="instructions">
        <InstructionsTab />
      </TabsContent>
      
      <TabsContent value="notes">
        <NotesTab />
      </TabsContent>
      
      <TabsContent value="equipment">
        <EquipmentTab />
      </TabsContent>
    </Tabs>
  );
};

export default EditorTabs;
