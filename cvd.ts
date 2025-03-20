declare lower;

input volumeLength = 4;  # User-defined input for the length of the volume moving average
input volumeMultiplier = 1.5;  # Only consider volume spikes that are 1.5x the average
input averageType = AverageType.EMA; # Choose between EMA and HMA
input volumeROCPeriod = 3;  # Volume ROC to check for consistent increase

#def isUptrend = close > close[1] and volume > volumeThreshold;  # Price rising and volume spike above threshold
#def isDowntrend = close < close[1] and volume > volumeThreshold;  # Price falling and volume spike above threshold

# Choose the average based on user input
def volumeAverage = MovingAverage(averageType, volume, volumeLength);

def volumeThreshold = volumeAverage * volumeMultiplier;
def volumeROC = (volume - volume[volumeROCPeriod]) / volume[volumeROCPeriod];


def buyVolume = if close > close[1] then volume else 0;
def sellVolume = if close < close[1] then volume else 0;
def delta = buyVolume - sellVolume;

# Reset CVD to zero on each new interval (e.g., each minute or bar)
# def resetCVD = GetTime() != GetTime()[1];  # Detects when a new bar starts

# Calculate CVD, reset to zero on each new bar, and accumulate during the bar
def CVD = CVD[1] + delta;


# Define trend conditions
def isUptrend = close > close[1] and volume > volumeThreshold and volumeROC > 0;
def isDowntrend = close < close[1] and volume > volumeThreshold and volumeROC > 0;
def noTrend = !isUptrend and !isDowntrend;  # No clear trend (either low volume or small price change)

# Plot CVD with adjusted color
plot CumulativeVolumeDelta = CVD;
CumulativeVolumeDelta.AssignValueColor(
    if isUptrend then Color.GREEN
    else if isDowntrend then Color.RED
    else Color.WHITE
);
