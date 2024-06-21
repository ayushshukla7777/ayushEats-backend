import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import Category from "../models/category";
import mongoose from "mongoose";
import { log } from "console";

const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;


    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const selectedCategories = (req.query.selectedCategories as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};


    

    query["city"] = new RegExp(city, "i");
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisinesArray };
    }



    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // sortOption = "lastUpdated"
    const restaurants: Array<{
      _id: mongoose.Schema.Types.ObjectId;
      restaurantName: string;
      city: string;
      country: string;
      deliveryPrice: number;
      estimatedDeliveryTime: number;
      cuisines: string[];
      menuItems: Array<{ name: string; _id: mongoose.Schema.Types.ObjectId; price: number }>;
      imageUrl: string;
      lastUpdated: Date;
      category?: { _id: mongoose.Schema.Types.ObjectId; name: string } | null;
      user?: mongoose.Schema.Types.ObjectId;
    }> = await Restaurant.find(query)
      .populate("category")
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();


      console.log("rest",restaurants);
      let filteredRestaurants = restaurants;
      console.log("filteredRestaurants",filteredRestaurants);
     console. log("selectedCategories", selectedCategories);
      
    // Filtering the restaurants based on the category name from the request body
    if(selectedCategories !== ""){
      filteredRestaurants = restaurants.filter(restaurant => {
        const selectedCategoriesArray = selectedCategories.split(",");
  
        
        return selectedCategoriesArray.includes(restaurant?.category?.name ?? '');
      });
    }

    console.log("fliteredrest", filteredRestaurants);


    // const restaurantNew = restaurants.filter((restaurant) => {
    //   return restaurant.category && restaurant.category.name == req.body.category;
    // });

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: filteredRestaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
    console.log(response)

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};




export default {
  getRestaurant,
  searchRestaurant,
};
