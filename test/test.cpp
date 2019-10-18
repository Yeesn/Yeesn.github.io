#include "car.h"
#if IN_CPP
template <class T>
car<T>::car(T a)
{
    data = a;
}
template <class T>
void car<T>::print()
{
    cout << "data = " << data << endl;
}
#endif
void callTest()
{
    car<int> a(33);
    a.print();
}