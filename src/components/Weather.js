import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWeatherAsync, getCitiesAsync } from "../redux/weatherSlice";

function Weather() {
  // selectedCity state'i, seçilen şehri tutmak için kullanılır
  const [selectedCity, setSelectedCity] = useState({});

  // useSelector hook'u ile Redux store'dan cities ve items değerlerini alıyoruz
  const cities = useSelector((state) => state.weather.cities);
  const items = useSelector((state) => state.weather.items);
  console.log(items);

  // useDispatch hook'u ile Redux store'da tanımlanan action'ları kullanabilmek için bir dispatch fonksiyonu alıyoruz
  const dispatch = useDispatch();

  // selectedCity değeri değiştiğinde çalışacak useEffect
  useEffect(() => {
    if (selectedCity) {
      // selectedCity değiştiğinde getWeatherAsync action'ını tetikliyoruz
      dispatch(getWeatherAsync(selectedCity));
    }
  }, [dispatch, selectedCity]);

  // Component yüklendiğinde çalışacak useEffect
  useEffect(() => {
    // getCitiesAsync action'ını tetikliyoruz
    dispatch(getCitiesAsync());
  }, [dispatch]);

  // Şehir seçimi değiştiğinde çalışacak fonksiyon
  const handleCityChange = (e) => {
    // Şehir seçimi değiştiğinde selectedCity state'ini güncelliyoruz
    const selectedCity = e.target.value.split(",")[0];
    setSelectedCity(selectedCity);
    // Şehir seçimi değiştiğinde getWeatherAsync action'ını tetikliyoruz

    dispatch(getWeatherAsync(selectedCity));
  };

  // Sadece her günün bir öğesini seçen fonksiyon
  const selectOneItemPerDay = (data) => {
    const selectedItems = [];
    const selectedDays = [];

    data.forEach((item) => {
      const day = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "long",
      });

      if (selectedDays.length < 6 && !selectedDays.includes(day)) {
        selectedItems.push(item);
        selectedDays.push(day);
      }
    });

    return selectedItems;
  };

  // Tek bir öğe seçilmiş verileri kullanarak ekrana basan kod
  const selectedItems = selectOneItemPerDay(items);

  return (
    <>
      <h2>Choose a City:</h2>
      <select value={selectedCity} onChange={handleCityChange}>
        <option value="">Select a city</option>
        {cities.map((city, index) => (
          <option key={index} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
      <div className="container">
        {!selectedItems || selectedItems.length === 0 ? (
          <div>Loading...</div>
        ) : (
          <div className="card-main">
            <h2>{selectedCity.toUpperCase()}</h2>
            {/* <h3>
              {new Date(selectedItems[0].dt * 1000).toLocaleDateString(
                "tr-TR",
                {
                  weekday: "long",
                }
              )}
            </h3> */}
            <p className="temp">{`${Math.round(
              selectedItems[0].main.temp
            )}°C`}</p>
            <p className="desc">
              {selectedItems[0].weather[0].description.toUpperCase()}
            </p>
            <p className="wind">{`Rüzgar Hızı: ${Math.round(
              selectedItems[0].wind.speed
            )}-Kmh`}</p>
            <p className="bas">Basınç: {selectedItems[0].main.pressure}</p>
            <p className="nem">Nem: {selectedItems[0].main.humidity}</p>
            <div className="sub-cards">
              {selectedItems.slice(1).map((item, index) => {
                return (
                  <div className="card" key={index}>
                    <h3>
                      {new Date(item.dt * 1000).toLocaleDateString("tr-TR", {
                        weekday: "long",
                      })}
                    </h3>
                    <p>{`${Math.round(item.main.temp)}°C`}</p>
                    <p>{item.weather[0].description.toUpperCase()}</p>
                    <p>{`Rüzgar Hızı: ${Math.round(item.wind.speed)}-Kmh`}</p>
                    <p>Basınç: {item.main.pressure}</p>
                    <p>Nem: {item.main.humidity}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Weather;
