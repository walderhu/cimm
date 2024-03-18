import unittest
import UnitArrayHelper
import UnitAtom 
import UnitEdge 

def suite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.makeSuite(UnitArrayHelper.TestAddFunction))
    test_suite.addTest(unittest.makeSuite(UnitAtom.TestAddFunction))
    # test_suite.addTest(unittest.makeSuite(UnitEdge.TestAddFunction))
    return test_suite

if __name__ == '__main__':
    runner = unittest.TextTestRunner()
    runner.run(suite())