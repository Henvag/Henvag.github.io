"""


combination_1and2 = 2000 + 2400 #40 minutes




combination_1and3 = 2000 + 1400 #30 minutes
combination_1and5 = 2000 + 1700 #50 minutes

combination_2and3 = 2400 + 1400 #50 minutes
combination3 = 1400 #20 minutes
combination4 = 1500 #50 minutes
combination5 = 1700 #40 minutes

#print all the combinations with a for loop

combinations = [combination_1and2, combination_1and3, combination_1and5, combination_2and3, combination3, combination4, combination5]



print(max(combinations)) #2400



"""


class Rocket:
    def __init__(self, fuel=100):
        self.fuel = fuel

    def launch(self):
        if self.fuel > 0:
            print("Rocket launched")
            self.fuel -= 20
        else:
            print("No fuel")

    def land(self):
        pass

    def call_home(self):
        pass

    def radio_message(self):
        pass
