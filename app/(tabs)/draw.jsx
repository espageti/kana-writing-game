import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text,  Image} from 'react-native';
import { Svg, Path } from 'react-native-svg';

const { height, width } = Dimensions.get('window');

const kana = [
  // 'a', 'i', 'u', 'e', 'o',
  'ka', 'ki', 'ku', 'ke', 'ko',
  // 'sa', 'shi', 'su', 'se', 'so',
  // 'ta', 'chi', 'tsu', 'te', 'to',
  // 'na', 'ni', 'nu' ,'ne', 'no',
  // 'ha', 'hi', 'fu', 'he', 'ho',
  'ma', 'mi', 'mu', 'me', 'mo',
  // 'ya', 'yu', 'yo',
  'ra', 'ri', 'ru', 're', 'ro',
  'wa', 'wo',
  'n'
];
const katakanaFile = {
  a: require('../../assets/katakana/a.png'),
  i: require('../../assets/katakana/i.png'),
  u: require('../../assets/katakana/u.png'),
  e: require('../../assets/katakana/e.png'),
  o: require('../../assets/katakana/o.png'),
  ka: require('../../assets/katakana/ka.png'),
  ki: require('../../assets/katakana/ki.png'),
  ku: require('../../assets/katakana/ku.png'),
  ke: require('../../assets/katakana/ke.png'),
  ko: require('../../assets/katakana/ko.png'),
  sa: require('../../assets/katakana/sa.png'),
  shi: require('../../assets/katakana/shi.png'),
  su: require('../../assets/katakana/su.png'),
  se: require('../../assets/katakana/se.png'),
  so: require('../../assets/katakana/so.png'),
  ta: require('../../assets/katakana/ta.png'),
  chi: require('../../assets/katakana/chi.png'),
  tsu: require('../../assets/katakana/tsu.png'),
  te: require('../../assets/katakana/te.png'),
  to: require('../../assets/katakana/to.png'),
  na: require('../../assets/katakana/na.png'),
  ni: require('../../assets/katakana/ni.png'),
  nu: require('../../assets/katakana/nu.png'),
  ne: require('../../assets/katakana/ne.png'),
  no: require('../../assets/katakana/no.png'),
  ha: require('../../assets/katakana/ha.png'),
  hi: require('../../assets/katakana/hi.png'),
  fu: require('../../assets/katakana/fu.png'),
  he: require('../../assets/katakana/he.png'),
  ho: require('../../assets/katakana/ho.png'),
  ma: require('../../assets/katakana/ma.png'),
  mi: require('../../assets/katakana/mi.png'),
  mu: require('../../assets/katakana/mu.png'),
  me: require('../../assets/katakana/me.png'),
  mo: require('../../assets/katakana/mo.png'),
  ya: require('../../assets/katakana/ya.png'),
  yu: require('../../assets/katakana/yu.png'),
  yo: require('../../assets/katakana/yo.png'),
  ra: require('../../assets/katakana/ra.png'),
  ri: require('../../assets/katakana/ri.png'),
  ru: require('../../assets/katakana/ru.png'),
  re: require('../../assets/katakana/re.png'),
  ro: require('../../assets/katakana/ro.png'),
  wa: require('../../assets/katakana/wa.png'),
  wo: require('../../assets/katakana/wo.png'),
  n: require('../../assets/katakana/n.png'),
};


const GameStates = Object.freeze({
  PRESTART: 1,
  ONGOING: 2,
  FINISHED: 3,
})


export default () => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const svgRef = useRef(null);
  const [gameState, setGameState] = useState(GameStates.PRESTART)

  const [kanaLeft, setKanaLeft] = useState(kana);

  const onStart = (event) => {
    const { x, y } = extractCoordinates(event);
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const onMove = (event) => {
    if (!isDrawing) return;
    const { x, y } = extractCoordinates(event);
    setCurrentPath((prevPath) => [...prevPath, { x, y }]);
  };

  const onEnd = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setPaths((prevPaths) => [...prevPaths, currentPath]);
      setCurrentPath([]);
    }
  };

  const extractCoordinates = (event) => {
    if (event.nativeEvent.touches && event.nativeEvent.touches.length > 0) {
      // Touch event (mobile)
      const touch = event.nativeEvent.touches[0];
      const rect = svgRef.current.getBoundingClientRect();
      return { x: touch.pageX.toFixed(0) - rect.left, y: touch.pageY.toFixed(0) - rect.top};
    } else {
      // Mouse event (web)
      const rect = svgRef.current.getBoundingClientRect();
      const x = (event.nativeEvent.pageX || event.pageX) - rect.left;
      const y = (event.nativeEvent.pageY || event.pageY) - rect.top;
      return { x, y };
    }
  };

  const handleClearButtonClick = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  const handleShowAnswerClick = () => {
    setReveal(true);
  }

  const changeCharacter = () => 
  {
    
    setCharIndex(Math.floor(Math.random() * (kanaLeft.length - 1)))
    handleClearButtonClick();
    setReveal(false);
    
  }

  const correctButtonClick = () =>
  {
    setTested(numTested + 1);
    setCorrect(numCorrect + 1);
    const newKanaArray = [
      ...kanaLeft.slice(0, currCharIndex),
      ...kanaLeft.slice(currCharIndex + 1)
    ];
    setKanaLeft(newKanaArray);
    if(kanaLeft.length - 1 <= 0)
    {
      setGameState(GameStates.FINISHED)
    }
    else
    {
      changeCharacter();
    }
    
  }

  const incorrectButtonClick = () =>
    {
      setTested(numTested + 1);
      changeCharacter();
    }

  const startGame = () =>
    {
      setKanaLeft(kana)
      handleClearButtonClick()
      setGameState(GameStates.ONGOING)
      setCorrect(0);
      setTested(0);
      setReveal(false)
    }

  const [numTested, setTested] = useState(0);
  const [numCorrect, setCorrect] = useState(0);
  //this is the index in kana left, by the way
  const [currCharIndex, setCharIndex] = useState(Math.floor(Math.random() * kanaLeft.length))
  const [answerRevealed, setReveal] = useState(false)
  
  const CharacterAnswer = () => 
  {
    if(answerRevealed)
      {
      return <Image
        style={styles.overlayImage}
        source={katakanaFile[kanaLeft[currCharIndex]]}
      />
      } 
  }

  const Buttons = () => 
    {
      if(!answerRevealed)
      {
        return <View style = {{flexDirection: 'row', marginHorizontal: 20}}>
        <TouchableOpacity style={styles.button} onPress={handleClearButtonClick}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <View style = {{width: 20}}/>
        <TouchableOpacity style={styles.button} onPress={handleShowAnswerClick}>
          <Text style={styles.buttonText}>Show</Text>
        </TouchableOpacity>
      </View>
      } 
      else
      {
        return <View style = {{flexDirection: 'column'}}>
          <View style = {{flexDirection: 'row', marginHorizontal: 20}}>
          <TouchableOpacity style={styles.button} onPress={incorrectButtonClick}>
            <Text style={styles.buttonText}>Incorrect</Text>
          </TouchableOpacity>
          <View style = {{width: 20}}/>
          <TouchableOpacity style={styles.button} onPress={correctButtonClick}>
            <Text style={styles.buttonText}>Correct</Text>
          </TouchableOpacity>
        </View>
        <View style = {{flexDirection: 'row', justifyContent: 'center', marginHorizontal: 20}}>
          <TouchableOpacity style={styles.button} onPress={handleClearButtonClick}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        

      </View>
      }
    }

  switch(gameState) 
  {
    case GameStates.PRESTART:
      return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      );
    case GameStates.FINISHED:
      return (
        <View style={styles.container}>
          <Text style = {styles.titleText}>Finished!</Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )
    case GameStates.ONGOING:
      return (
        <View style={styles.container}>
          <View>
            <Text style = {styles.titleText}>{kanaLeft[currCharIndex]}</Text>
          </View>
          <View
            ref={svgRef}
            style={styles.svgContainer}
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={onEnd}
            onMouseDown={onStart}
            onMouseMove={onMove}
            onMouseUp={onEnd}
          >
        
            <Svg height={height * 0.6} width={height * 0.6} style = {styles.svg}>
              {paths.map((path, index) => (
                <Path
                  key={`path-${index}`}
                  d={path.map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')}
                  stroke={'red'}
                  fill={'transparent'}
                  strokeWidth={8}
                  strokeLinejoin={'round'}
                  strokeLinecap={'round'}
                />
              ))}
              <Path
                d={currentPath.map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')}
                stroke={'red'}
                fill={'transparent'}
                strokeWidth={10}
                strokeLinejoin={'round'}
                strokeLinecap={'round'}
              />
            </Svg>
            <Image
              style={styles.overlayImage}
              source={require('../../assets/writingsquare.png')}
            />
            <CharacterAnswer/>
          </View>
          <Buttons/>
          <Text style = {styles.titleText}> {numCorrect} / {numTested} correct </Text>
        </View>
      );
  }
  
};



const styles = StyleSheet.create({
  titleText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgContainer: {
    height: height * 0.6,
    width: height * 0.6,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  overlayImage: {
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFillObject,
    opacity: 1 , // Adjust the opacity as needed
    zIndex: 0
  },
  svg: {
    zIndex: 1
  },
  button: {
    marginTop: 10,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


//https://fr.wikibooks.org/wiki/Japonais/Katakana/Le%C3%A7on1