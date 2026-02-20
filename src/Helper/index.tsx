import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from "react-native-image-picker";

const pickImageFromGallery = async (): Promise<Asset | null> => {
  const options: ImageLibraryOptions = {
    mediaType: "photo",
    quality: 1,
    selectionLimit: 1, // For single selection
  };

  try {
    const response = await launchImageLibrary(options);

    if (response.didCancel) {
      console.log("User cancelled image picker");
      return null;
    } else if (response.errorCode) {
      console.log("ImagePicker Error: ", response.errorMessage);
      return null;
    } else if (response.assets && response.assets.length > 0) {
      // Return the first selected asset
      return response.assets[0];
    }

    return null;
  } catch (error) {
    console.error("Error picking image:", error);
    return null;
  }
};

export {pickImageFromGallery};
