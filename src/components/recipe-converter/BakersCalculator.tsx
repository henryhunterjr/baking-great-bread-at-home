import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { RecipeData } from '@/types/recipeTypes';

interface BakersCalculatorProps {
  recipe?: RecipeData;
}

const BakersCalculator: React.FC<BakersCalculatorProps> = ({ recipe }) => {
  const [flourWeight, setFlourWeight] = useState<number>(500);
  const [hydration, setHydration] = useState<number>(70);
  const [saltPercentage, setSaltPercentage] = useState<number>(2);
  const [starterPercentage, setStarterPercentage] = useState<number>(20);
  const [starterHydration, setStarterHydration] = useState<number>(100);

  const [totalDoughWeight, setTotalDoughWeight] = useState<number>(0);
  const [waterWeight, setWaterWeight] = useState<number>(0);
  const [saltWeight, setSaltWeight] = useState<number>(0);
  const [starterWeight, setStarterWeight] = useState<number>(0);
  const [totalFlourWeight, setTotalFlourWeight] = useState<number>(0);

  useEffect(() => {
    // Calculate water weight based on flour weight and hydration percentage
    const calculatedWaterWeight = (flourWeight * (hydration / 100));
    setWaterWeight(calculatedWaterWeight);

    // Calculate salt weight based on flour weight and salt percentage
    const calculatedSaltWeight = (flourWeight * (saltPercentage / 100));
    setSaltWeight(calculatedSaltWeight);

    // Calculate starter weight based on flour weight and starter percentage
    const calculatedStarterWeight = (flourWeight * (starterPercentage / 100));
    setStarterWeight(calculatedStarterWeight);

    // Calculate total flour weight (flour + starter flour)
    const calculatedTotalFlourWeight = flourWeight + (calculatedStarterWeight / (1 + (starterHydration / 100)));
    setTotalFlourWeight(calculatedTotalFlourWeight);

    // Calculate total dough weight (flour + water + salt + starter)
    const calculatedTotalDoughWeight = calculatedTotalFlourWeight + calculatedWaterWeight + calculatedSaltWeight + calculatedStarterWeight;
    setTotalDoughWeight(calculatedTotalDoughWeight);
  }, [flourWeight, hydration, saltPercentage, starterPercentage, starterHydration]);

  // Convert complex ingredient objects to strings if needed
  const processedIngredients = recipe?.ingredients?.map(ingredient => {
    if (typeof ingredient === 'string') {
      return ingredient;
    } else if (typeof ingredient === 'object' && ingredient !== null) {
      // Format object to string
      const quantity = ingredient.quantity || '';
      const unit = ingredient.unit || '';
      const name = ingredient.name || '';
      return `${quantity} ${unit} ${name}`.trim();
    }
    return String(ingredient);
  }) || [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Baker's Percentage Calculator</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="flourWeight">Flour Weight (grams)</Label>
          <Input
            type="number"
            id="flourWeight"
            value={flourWeight}
            onChange={(e) => setFlourWeight(Number(e.target.value))}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hydration">Hydration (%)</Label>
          <Slider
            id="hydration"
            defaultValue={[hydration]}
            max={100}
            step={1}
            onValueChange={(value) => setHydration(value[0])}
          />
          <Input
            type="number"
            value={hydration}
            readOnly
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="saltPercentage">Salt (%)</Label>
          <Slider
            id="saltPercentage"
            defaultValue={[saltPercentage]}
            max={5}
            step={0.1}
            onValueChange={(value) => setSaltPercentage(value[0])}
          />
          <Input
            type="number"
            value={saltPercentage}
            readOnly
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="starterPercentage">Starter (%)</Label>
          <Slider
            id="starterPercentage"
            defaultValue={[starterPercentage]}
            max={50}
            step={1}
            onValueChange={(value) => setStarterPercentage(value[0])}
          />
          <Input
            type="number"
            value={starterPercentage}
            readOnly
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="starterHydration">Starter Hydration (%)</Label>
          <Slider
            id="starterHydration"
            defaultValue={[starterHydration]}
            max={100}
            step={1}
            onValueChange={(value) => setStarterHydration(value[0])}
          />
          <Input
            type="number"
            value={starterHydration}
            readOnly
          />
        </div>

        <Separator />

        <div className="grid gap-2">
          <Label>Total Dough Weight (grams)</Label>
          <Input type="number" value={totalDoughWeight.toFixed(2)} readOnly />
        </div>
        <div className="grid gap-2">
          <Label>Water Weight (grams)</Label>
          <Input type="number" value={waterWeight.toFixed(2)} readOnly />
        </div>
        <div className="grid gap-2">
          <Label>Salt Weight (grams)</Label>
          <Input type="number" value={saltWeight.toFixed(2)} readOnly />
        </div>
        <div className="grid gap-2">
          <Label>Starter Weight (grams)</Label>
          <Input type="number" value={starterWeight.toFixed(2)} readOnly />
        </div>
        <div className="grid gap-2">
          <Label>Total Flour Weight (grams)</Label>
          <Input type="number" value={totalFlourWeight.toFixed(2)} readOnly />
        </div>

        <Separator />

        <div>
          <h3>Recipe Ingredients:</h3>
          <ul>
            {processedIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BakersCalculator;
