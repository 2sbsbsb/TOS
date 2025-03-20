# Cummulative volume trend
declare lower;

input volumeLength = 4;  # User-defined input for the length of the volume moving average
input averageType = AverageType.EMA; # Choose between EMA and HMA

# Choose the average based on user input
def volumeAverage = if averageType == AverageType.EMA then
                        ExpAverage(volume, volumeLength)  # Exponential Moving Average
                    else
                        MovingAverage(AverageType.HULL, volume, volumeLength);  # Hull Moving Average

def buyVolume = if close > close[1] then volume else 0;
def sellVolume = if close < close[1] then volume else 0;
def delta = buyVolume - sellVolume;
def CVD = CompoundValue(1, CVD[1] + delta, delta);

# Define trend conditions
def isUptrend = close > close[1] and volume > volumeAverage;  # Price rising and volume above average
def isDowntrend = close < close[1] and volume > volumeAverage;  # Price falling and volume above average
def noTrend = !isUptrend and !isDowntrend;  # No clear trend (either low volume or small price change)

# Plot CVD with adjusted color
plot CumulativeVolumeDelta = CVD;
CumulativeVolumeDelta.AssignValueColor(
    if isUptrend then Color.GREEN
    else if isDowntrend then Color.RED
    else Color.WHITE
);
